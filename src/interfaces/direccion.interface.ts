import IUbicacion from './ubicacion.interface';

export default interface IDireccion {
    valor: String;
    codigoPostal: String;
    ubicacion: IUbicacion;
    ranking: Number;
    geoReferencia: [Number, Number];
    ultimaActualizacion: Date;
    activo: Boolean;
}
