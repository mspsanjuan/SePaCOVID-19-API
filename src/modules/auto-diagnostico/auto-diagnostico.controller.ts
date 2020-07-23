import { Router, NextFunction, Request, Response } from 'express';
import * as moment from 'moment';

import Controller from '../../interfaces/controller.interface';
import IAgenda from '../../interfaces/agenda.interface';
import IProfesional from '../../interfaces/profesional.interface';
import IBloque from '../../interfaces/bloque.interface';
import ITipoPrestacion from '../../interfaces/tipo-prestacion.interface';
import IPrestacionRegistro from '../../interfaces/prestacion-registro.interface';
import ISeguimientoPaciente from '../../interfaces/seguimiento-paciente.interface';
import IPaciente from '../../interfaces/paciente.interface';

import HttpException from '../../exceptions/HttpException';
import pacienteService from '../../services/pacientes.service';
import profesionalService from '../../services/profesional.service';
import agendaService from '../../services/agenda.service';
import turnoService from '../../services/turno.service';
import seguimientoPacienteService from '../../services/seguimiento-paciente.service';

export default class AutoDiagnosticoController implements Controller {
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

    private _registroLlevadoPorPaciente: IPrestacionRegistro = {
        registros: [],
        elementoRUP: '5e8cb7ebfb2be91325677e58',
        nombre: 'hallazgo informado por el sujeto o el que relata la historia',
        concepto: {
            refsetIds: [
                '900000000000497000'
            ],
            fsn: 'hallazgo informado por el sujeto o el que relata la historia (hallazgo)',
            semanticTag: 'hallazgo',
            conceptId: '418799008',
            term: 'hallazgo informado por el sujeto o el que relata la historia'
        },
        valor: []
    };

    private _mapRegistros: {[key: string]: {type: 'number' | 'array', registro: IPrestacionRegistro, valorPorDefecto?: any }} = {
        temperatura: {
            type: 'number',
            registro: {
                nombre: 'temperatura corporal',
                elementoRUP: '594a80a3884431c25d9a025e',
                registros: [],
                concepto: {
                    refsetIds: [
                        '900000000000497000',
                        '900000000000498005'
                    ],
                    fsn: 'temperatura corporal (entidad observable)',
                    semanticTag: 'entidad observable',
                    conceptId: '386725007',
                    term: 'temperatura corporal'
                },
                valor: null
            },
        },
        diarrea: {
            type: 'array',
            registro: this._registroLlevadoPorPaciente,
            valorPorDefecto: {
                id: '62315008',
                nombre: 'diarrea',
                concepto: {
                    fsn: 'diarrea (hallazgo)',
                    term: 'diarrea',
                    conceptId: '62315008',
                    semanticTag: 'hallazgo'
                }
            }
        },
        dolorGarganta: {
            type: 'array',
            registro: this._registroLlevadoPorPaciente,
            valorPorDefecto: {
                id: '162397003',
                nombre: 'dolor de garganta',
                concepto: {
                    fsn: 'dolor de garganta (hallazgo)',
                    term: 'dolor de garganta',
                    conceptId: '162397003',
                    semanticTag: 'hallazgo'
                }
            }
        }
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
                const resPacienteValidar = await pacienteService.validar({
                    activo: true,
                    alias: '',
                    apellido: '',
                    claveBlocking: null,
                    contacto: [],
                    cuil: null,
                    direccion: [],
                    documento: pacienteQuery.documento,
                    edad: null,
                    edadReal: null,
                    entidadesValidadoras: [''],
                    estado: 'temporal',
                    fechaFallecimiento: null,
                    fechaNacimiento: null,
                    financiador: null,
                    foto: null,
                    genero: pacienteQuery.sexo,
                    id: null,
                    identificadores: null,
                    nombre: '',
                    nombreCompleto: '',
                    notaError: '',
                    numeroIdentificacion: '',
                    relaciones: null,
                    reportarError: false,
                    scan: null,
                    sexo: pacienteQuery.sexo,
                    tipoIdentificacion: '',
                    estadoCivil: null,
                });
                if (!resPacienteValidar.data || !resPacienteValidar.data.validado) {
                    return next(new HttpException(400, 'El paciente no pudo ser validado'));
                } else {
                    const resPacienteNuevo = await pacienteService.post(resPacienteValidar.data.paciente);
                    resPaciente.data.push(resPacienteNuevo.data);
                    resPaciente.code = resPacienteNuevo.code;
                }
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
            // Creamos la coleccion de seguimiento de paciente
            const resSeguimientoPaciente = await seguimientoPacienteService.post(
                this.crearSeguimientoPaciente(request.body.registros, resPaciente.data[0], resProfesional.data[0])
            );
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

            response.send({
                paciente: {
                    status: resPaciente.code,
                    data: resPaciente.data
                },
                profesional: {
                    status: resProfesional.code,
                    data: resProfesional.data,
                },
                agenda: {
                    status: resAgenda.code,
                    data: resAgenda.data,
                },
                turno: {
                    status: resTurno.code,
                    data: resTurno.data,
                },
                seguimientoPaciente: {
                    status: resSeguimientoPaciente.code,
                    data: resSeguimientoPaciente.data
                }
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

    private crearSeguimientoPaciente(bodyRegistros: any, paciente: IPaciente, profesional: IProfesional): ISeguimientoPaciente {
        const seguimientoPaciente: ISeguimientoPaciente = {
            paciente,
            profesional,
            registro: {
                nombre: 'registro llevado por el paciente',
                concepto: {
                    refsetIds: [
                        '900000000000497000'
                    ],
                    fsn: 'registro llevado por el paciente (elemento de registro)',
                    semanticTag: 'elemento de registro',
                    conceptId: '408403008',
                    term: 'registro llevado por el paciente'
                },
                elementoRUP: '5e8c926ffb2be91325677e56',
                valor: null,
                registros: []
            }
        };

        for (let key in bodyRegistros) {
            if (bodyRegistros[key] && this._mapRegistros[key]) {
                // agregamos el registro si este no está agregado
                let foundIndex = seguimientoPaciente.registro.registros.findIndex(x => x.concepto.conceptId === this._mapRegistros[key].registro.concepto.conceptId);
                if (foundIndex < 0) {
                    foundIndex = seguimientoPaciente.registro.registros.push(this._mapRegistros[key].registro) - 1;
                }
                switch (this._mapRegistros[key].type) {
                    case 'array':
                        seguimientoPaciente.registro.registros[foundIndex].valor.push(this._mapRegistros[key].valorPorDefecto);
                        break;
                    case 'number':
                        seguimientoPaciente.registro.registros[foundIndex].valor = bodyRegistros[key];
                        break;
                }
            }
        }

        return seguimientoPaciente;
    }
}
