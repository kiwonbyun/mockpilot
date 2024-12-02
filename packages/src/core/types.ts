export type HttpMethod = "get" | "post" | "put" | "delete" | "patch";
export type HttpStatus =
  | null
  | 200
  | 201
  | 400
  | 401
  | 403
  | 404
  | 409
  | 500
  | 502
  | 503;

export interface MockConfig {
  url: string;
  method?: HttpMethod;
  status?: HttpStatus;
  delay?: number;
  response?: any;
}

export interface MockState extends MockConfig {
  id: string;
  isActive: boolean;
}

export interface MockMate {
  start: () => Promise<void>;
  mock: (config: MockConfig) => void;
  getMocks: () => MockState[];
  enable: (id: string) => void;
  disable: (id: string) => void;
  remove: (id: string) => void;
  reset: () => void;
}
