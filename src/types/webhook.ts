/** Payload para criar/atualizar configuração de webhook */
export interface UpdateWebhookRequest {
  url: string;
  email?: string;
  interrupted?: boolean;
  enabled?: boolean;
  apiVersion?: number;
  authToken?: string;
}

/** Configuração de webhook retornada pela API */
export interface WebhookSettings {
  url?: string;
  email?: string;
  interrupted?: boolean;
  enabled?: boolean;
  apiVersion?: number;
  authToken?: string;
  [key: string]: unknown;
}
