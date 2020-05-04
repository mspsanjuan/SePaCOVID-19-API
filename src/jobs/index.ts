export type JobFunctionType = () => Promise<void>;

const jobs: {[key: string]: JobFunctionType} = {
    // /**
    //  * Añade las localidades, junto a las provincias, paises y departamentos
    //  * que no esten en la base de datos.
    //  * @example npm run job addLocalidades "path/of/localidades.json"
    //  */
    // addLocalidades: AddLocalidadesJob,
};

export default jobs;
