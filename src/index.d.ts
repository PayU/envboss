declare module 'envboss'
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
export declare const mandatory:boolean
export declare function createEnvObject(paramsConfig:ParamsConfiguration, shouldValidateEnvParams?:boolean): EnvironmentVariables;

