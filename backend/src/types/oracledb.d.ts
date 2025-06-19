declare module 'oracledb' {
  export const OUT_FORMAT_OBJECT: number;
  export let autoCommit: boolean;
  
  export interface InitOracleClientOptions {
    libDir?: string;
    configDir?: string;
    errorUrl?: string;
    driverName?: string;
  }
  
  export interface ExecuteOptions {
    outFormat?: number;
    autoCommit?: boolean;
    maxRows?: number;
    fetchArraySize?: number;
    [key: string]: any;
  }
  
  export interface ExecuteReturn {
    rows: any[];
    metaData: any[];
    [key: string]: any;
  }
  
  export interface Connection {
    execute(sql: string, binds?: any[], options?: ExecuteOptions): Promise<ExecuteReturn>;
    close(): Promise<void>;
    [key: string]: any;
  }
  
  export interface ConnectionAttributes {
    user: string;
    password: string;
    connectString: string;
    [key: string]: any;
  }
  
  export function getConnection(attributes: ConnectionAttributes): Promise<Connection>;
  export function initOracleClient(options?: InitOracleClientOptions): void;
}
