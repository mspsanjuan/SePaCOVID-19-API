import { Router, NextFunction, Request, Response } from 'express';

import Controller from '../../interfaces/controller.interface';
import IAgenda from '../../interfaces/agenda.interface';
import IProfesional from '../../interfaces/profesional.interface';
import IBloque from '../../interfaces/bloque.interface';
import ITipoPrestacion from '../../interfaces/tipo-prestacion.interface';

import HttpException from '../../exceptions/HttpException';
import pacienteService from '../../services/pacientes.service';
import profesionalService from '../../services/profesional.service';
import agendaService from '../../services/agenda.service';
import * as moment from 'moment';

export default class AutoDiagnostico implements Controller {
    public path = '/autodiagnostico';
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}`, this.postRegisterData);
    }

    private postRegisterData = async (request: Request, response: Response, next: NextFunction) => {
        const pacienteQuery = request.body.paciente;
        const profesionalQuery = request.body.profesional;

        try {
            // Busqueda de paciente
            const resPaciente = await pacienteService.get(pacienteQuery);
            if (!resPaciente.data || resPaciente.data.length === 0) {
                // Creacion de un nuevo paciente
                return next(new HttpException(400, ''));
            } else if (resPaciente.data.length > 1) {
                return next(new HttpException(400, `Existen ${resPaciente.data.length} pacientes con los parametros ingresados`));
            }
            // Busqueda de profesional
            const resProfesional = await profesionalService.get(profesionalQuery);
            if (!resProfesional.data || resProfesional.data.length === 0) {
                return next(new HttpException(400, 'No existe un profesional con los parametros ingresados'));
            } else if (resProfesional.data.length > 1) {
                return next(new HttpException(400, `Existen ${resProfesional.data.length} profesionales con los parametros ingresados`));
            }
            // Busqueda de una agenda
            const fechaDesde = moment().startOf('day').add(1, 'day');
            const fechaHasta = moment().endOf('day').add(1, 'day');
            const resAgenda = await agendaService.get(fechaDesde.toDate(), fechaHasta.toDate(), resProfesional.data[0].id);
            if (!resAgenda.data || resAgenda.data.length === 0) {
                // Creacion de agenda
                resAgenda.data = [await this.crearAgenda(
                    fechaDesde.toDate(),
                    ['Prioridad Alta', 'Prioridad media', 'Prioridad Baja'],
                    6,
                    18,
                    resProfesional.data[0],
                )];
            } else if (resAgenda.data.length > 1) {
                return next(new HttpException(400, `Existen ${resAgenda.data.length} agendas en el mismo dia asociados al profesional`));
            }
            // Asignacion de paciente a la agenda
            response.send({
                paciente: resPaciente.data,
                profesional: resProfesional.data,
                agenda: resAgenda.data,
            });
        } catch (err) {
            next(new HttpException(400, err));
        }
    }

    private async crearAgenda(fecha: Date, nombresBloques: string[], horaInicio: number, horaFin: number, profesional: IProfesional): Promise<IAgenda | null> {

        const tipoPrestaciones: ITipoPrestacion[] = [
            {
                conceptId: '861000013109',
                fsn: 'Consulta de enfermería (procedimiento)',
                id: '5ad63b359fd75bb58ddafbad',
                semanticTag: 'procedimiento',
                term: 'Consulta de enfermería',
            }
        ];

        const nuevaAgenda: IAgenda = {
            bloques: new Array<IBloque>(),
            cupo: -1,
            dinamica: true,
            espacioFisico: null,
            fecha,
            horaInicio: moment(fecha).set('hour', horaInicio).toDate(),
            horaFin: moment(fecha).set('hour', horaFin).toDate(),
            nominalizada: true,
            organizacion: {
                id: '5bc890ad8f07a8512f5774f1',
                nombre: 'HOSPITAL DR. ALFREDO RIZO ESPARZA',
                _id: '5bc890ad8f07a8512f5774f1',
            },
            profesionales: [profesional],
            tipoPrestaciones,
        };

        // Agregamos los bloques
        let i = 0;
        const duracionTotal = horaFin - horaInicio;
        const duracionBloque = duracionTotal / nombresBloques.length;
        for (const nombre of nombresBloques) {
            nuevaAgenda.bloques.push({
                accesoDirectoDelDia: 0,
                accesoDirectoDelDiaPorc: 0,
                accesoDirectoProgramado: 0,
                cantidadBloque: null,
                cantidadSimultaneos: null,
                cantidadTurnos: 0,
                descripcion: nombre,
                horaInicio: moment(fecha).set('hour', horaInicio + duracionBloque * i).toDate(),
                horaFin: moment(fecha).set('hour', horaInicio + duracionBloque * (i + 1)).toDate(),
                duracionTurno: 0,
                indice: i,
                reservadoGestion: 0,
                reservadoGestionPorc: 0,
                reservadoProfesional: 0,
                reservadoProfesionalPorc: 0,
                tipoPrestaciones,
                turnos: [],
                nominalizada: true,
            });
            i++;
        }
        const res = await agendaService.post(nuevaAgenda);
        return res.data ? res.data : null;
    }
}
