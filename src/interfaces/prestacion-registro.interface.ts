import ISnomedConcept from './snomed-concept.interface';

export class IRegistroPrivacy {
    scope: string;
}

export default interface IPrestacionRegistro {
    id?: string;
    idPrestacion?: string;
    elementoRUP: string;
    /**
     * Indica el nombre del registro, calculado por el elementoRUP.
     * @example 'Prescripción de novalgina'
     */
    nombre: string;
    concepto: ISnomedConcept;
    /**
     * Indica si este registro está destacado
     */
    destacado?: Boolean;
    /**
     * Indica si este registro es una solicitud
     */
    esSolicitud?: Boolean;
    /**
     * Almacena el valor del átomo, molécula o fórmula.
     * Para el caso de las moléculas, el valor puede ser nulo.
     */
    valor: any | null;
    /**
     * Almacena los registros de los átomos asociados a la molécula
     */
    registros: IPrestacionRegistro[];
    /**
     * Indica los id de otros registros dentro array 'registros' de la prestación
     */
    relacionadoCon?: any[];
    esDiagnosticoPrincipal?: Boolean;
    /**
     * Indica si este registro es valido (no vacio)
     */
    valido?: Boolean;

    privacy?: IRegistroPrivacy;

    solicitud?: any;

    evoluciones?: any;
    transformado?: any;
    esPrimeraVez?: boolean;

    hasSections?: Boolean;
    isSection?: Boolean;
    noIndex?: Boolean;

    createdAt?: Date;
}
