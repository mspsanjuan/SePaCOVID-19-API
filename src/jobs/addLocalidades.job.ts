import { JobFunctionType } from '.';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import Pais from '../modules/pais/pais.model';
import Provincia from '../modules/provincia/provincia.model';
import Departamento from '../modules/departamento/departamento.schema';
import Localidad from '../modules/localidad/localidad.model';

interface ILocalidadData {
    codigoPostal: string;
    departamento: string;
    nombre: string;
    provincia: string;
    pais: string;
}

const filtrarData = (data: Array<ILocalidadData>) => {
    const filterData: {
        [pais: string]: {
            [prov: string]: {
                [dto: string]: Array<ILocalidadData>
            }
        }
    } = {};

    data.forEach(x => {
        const paisName = x.pais.toUpperCase();
        const provName = x.provincia.toUpperCase();
        const dptoName = x.departamento.toUpperCase();
        if (!filterData[paisName]) {
            filterData[paisName] = {};
        }
        if (!filterData[paisName][provName]) {
            filterData[paisName][provName] = {};
        }
        if (!filterData[paisName][provName][dptoName]) {
            filterData[paisName][provName][dptoName] = [];
        }
        filterData[paisName][provName][dptoName].push(x);
    });

    return filterData;
};

const AddLocalidadesJob: JobFunctionType = async () => {
    const fileName = process.argv[3];
    if (!fileName) {
        // tslint:disable-next-line: no-console
        console.log('\x1b[31mDebe proporcionar la ruta del archivo JSON\x1b[0m');
        return;
    }
    try {
        const buffer = readFileSync(join('', fileName));
        // tslint:disable-next-line: no-console
        // const data: Array<ILocalidadData> = JSON.parse(buffer.toString());
        const filterData = filtrarData(JSON.parse(buffer.toString()));
        // Guardamos en la base de datos
        for (const paisName in filterData) {
            let pais = await Pais.findOne({nombre: paisName});
            if (!pais) {
                pais = new Pais({nombre: paisName});
                pais = await pais.save();
            }

            for (const provName in filterData[paisName]) {
                let provincia = await Provincia.findOne({nombre: paisName, 'pais.nombre': pais.nombre});
                if (!provincia) {
                    provincia = new Provincia({nombre: provName, pais});
                    provincia = await provincia.save();
                }

                for (const dptoName in filterData[paisName][provName]) {
                    let departamento = await Departamento.findOne({nombre: dptoName, 'provincia.nombre': provincia.nombre});
                    if (!departamento) {
                        departamento = new Departamento({nombre: dptoName, provincia});
                        departamento = await departamento.save();
                    }

                    for (const value of filterData[paisName][provName][dptoName]) {
                        let localidad = new Localidad({
                            nombre: value.nombre,
                            codigoPostal: value.codigoPostal,
                            departamento
                        });
                        localidad = await localidad.save();
                    }
                }
            }
        }
        // A modo de prueba
        writeFileSync(join('.', 'output.json'), JSON.stringify(filterData, null, 2));

        // for (const value of data) {
        //     const paisName = value.pais.toUpperCase();
        //     const provName = value.provincia.toUpperCase();
        //     const dptoName = value.departamento.toUpperCase();
        //     let pais, provincia, departamento, localidad;
        //     // Creamos el pais si es necesario
        //     if (!filterData[paisName]) {
        //         pais = await Pais.findOne({nombre: paisName});
        //         if (!pais) {
        //             pais = new Pais({nombre: paisName});
        //             pais = await pais.save();
        //         }
        //         filterData[paisName] = {};
        //     }
        //     // Creamos la provincia si es necesario
        //     if (!filterData[paisName][provName]) {
        //         provincia = await Provincia.findOne({nombre: paisName, 'pais._id': pais.id});
        //         if (!provincia) {
        //             provincia = new Provincia({nombre: provName, pais});
        //             provincia = await provincia.save();
        //         }
        //         filterData[paisName][provName] = {};
        //     }
        //     // Creamos el departamento si es necesario
        //     if (!filterData[paisName][provName][dptoName]) {
        //         departamento = await Departamento.findOne({nombre: dptoName, 'provincia._id': provincia.id});
        //         if (!departamento) {
        //             departamento = new Departamento({nombre: dptoName, provincia});
        //             departamento = await departamento.save();
        //         }
        //         filterData[paisName][provName][dptoName] = [];
        //     }
        //     localidad = new Localidad({
        //         nombre: value.nombre,
        //         codigoPostal: value.codigoPostal,
        //         departamento
        //     });
        //     localidad = await localidad.save();
        //     filterData[paisName][provName][dptoName].push(localidad.nombre);
        // }

    } catch (err) {
        // tslint:disable-next-line: no-console
        console.log(`\x1b[31m${err}\x1b[0m`);
    }
};

export default AddLocalidadesJob;
