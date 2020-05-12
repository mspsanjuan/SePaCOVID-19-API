import { Router, NextFunction, Request, Response } from 'express';
import * as moment from 'moment';

import Controller from '../../interfaces/controller.interface';
import IAgenda from '../../interfaces/agenda.interface';
import IProfesional from '../../interfaces/profesional.interface';
import IBloque from '../../interfaces/bloque.interface';
import ITipoPrestacion from '../../interfaces/tipo-prestacion.interface';

import HttpException from '../../exceptions/HttpException';
import pacienteService from '../../services/pacientes.service';
import profesionalService from '../../services/profesional.service';
import agendaService from '../../services/agenda.service';
import turnoService from '../../services/turno.service';

export default class AutoDiagnostico implements Controller {
    public path = '/autodiagnostico';
    public router = Router();
    /**
     * Configuracion de las agendas en base a las prioridades
     */
    private _agendaConfig = [
        {
            nombre: 'Prioridad Baja',
            hora: 16,
        },
        {
            nombre: 'Prioridad Media',
            hora: 12,
        },
        {
            nombre: 'Prioridad Alta',
            hora: 8,
        },
    ];
    /**
     * Duracion de la agenda expresada en horas
     */
    private _duracionAgenda = 4;
    /**
     * Tipo de prestacion la cual se usa para crear y asignar las agendas
     */
    private _tipoPrestacion: ITipoPrestacion =  {
        conceptId: '861000013109',
        fsn: 'Consulta de enfermería (procedimiento)',
        id: '5ad63b359fd75bb58ddafbad',
        semanticTag: 'procedimiento',
        term: 'Consulta de enfermería',
    };

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
                return next(new HttpException(400, 'El paciente no existe'));
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
            // Parametros para definir prioridad
            const prioridadIndex = request.body.prioridad || 0;
            // Busqueda de una agenda
            const fechaDesde = moment().startOf('day').add(1, 'day').set('hour', this._agendaConfig[prioridadIndex].hora);
            const fechaHasta = moment().endOf('day').add(1, 'day').set('hour', this._agendaConfig[prioridadIndex].hora + this._duracionAgenda);
            const resAgenda = await agendaService.get(fechaDesde.toDate(), fechaHasta.toDate(), resProfesional.data[0].id);
            if (!resAgenda.data || resAgenda.data.length === 0) {
                // Creacion de agenda
                resAgenda.data = [await this.crearAgenda(fechaDesde.toDate(), this._duracionAgenda, this._agendaConfig[prioridadIndex].nombre, resProfesional.data[0])];
            } else if (resAgenda.data.length > 1) {
                return next(new HttpException(400, `Existen ${resAgenda.data.length} agendas en el mismo dia asociados al profesional`));
            }
            // Asignacion de paciente a la agenda
            const resTurno = await turnoService.patch(resAgenda.data[0], resPaciente.data[0], this._tipoPrestacion);
            console.log('TURNO: ', resTurno);
            response.send({
                paciente: resPaciente.data,
                profesional: resProfesional.data,
                agenda: resAgenda.data,
            });
        } catch (err) {
            next(new HttpException(400, err));
        }
    }

    private async crearAgenda(fecha: Date, horaDuracion: number , nombreBloque: string, profesional: IProfesional): Promise<IAgenda | null> {
        const horaInicio = fecha;
        const horaFin = moment(fecha).add(horaDuracion, 'hour').toDate();
        const nuevaAgenda: IAgenda = {
            bloques: new Array<IBloque>(),
            cupo: -1,
            dinamica: true,
            espacioFisico: null,
            fecha,
            horaInicio,
            horaFin,
            nominalizada: true,
            organizacion: {
                id: '5bc890ad8f07a8512f5774f1',
                nombre: 'HOSPITAL DR. ALFREDO RIZO ESPARZA',
                _id: '5bc890ad8f07a8512f5774f1',
            },
            profesionales: [profesional],
            tipoPrestaciones: [this._tipoPrestacion],
        };
        // Agregamos el bloque
        nuevaAgenda.bloques.push({
            accesoDirectoDelDia: 0,
            accesoDirectoDelDiaPorc: 0,
            accesoDirectoProgramado: 0,
            cantidadBloque: null,
            cantidadSimultaneos: null,
            cantidadTurnos: 0,
            descripcion: nombreBloque,
            horaInicio,
            horaFin,
            duracionTurno: 0,
            indice: 0,
            reservadoGestion: 0,
            reservadoGestionPorc: 0,
            reservadoProfesional: 0,
            reservadoProfesionalPorc: 0,
            tipoPrestaciones: [this._tipoPrestacion],
            turnos: [],
            nominalizada: true,
        });
        // Creamos la agenda (queda en planificacion)
        const resPost = await agendaService.post(nuevaAgenda);
        if (resPost.data !== undefined) {
            // Publicamos la agenda
            const resPatch = await agendaService.patch(resPost.data, 'publicada', 'publicada');
            if (resPatch.data !== undefined) {
                return resPatch.data;
            }
        }
        return null;
    }
}
