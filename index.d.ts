declare module 'env-vars-config'
interface ParamsConfiguration{
    [name:string]:ParamConfiguration
}
interface ParamConfiguration{
    mandatory?:boolean;
    default?: PrimitiveType;
    validValues?:PrimitiveType[]
    wrappingFunction?:(value:any)=>any
}

type PrimitiveType = number | string | boolean

export interface EnvironmentVariables{
    [name:string]:any
}
export declare function createEnvObject(paramsConfig:ParamsConfiguration, shouldValidateEnvParams?:boolean): EnvironmentVariables;

