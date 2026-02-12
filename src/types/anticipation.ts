/** Payload para simular antecipação */
export interface SimulateAnticipationRequest {
  installment?: string | null;
  payment?: string;
}

/** Payload para solicitar antecipação (campos do form; documentos via create com FormData) */
export interface CreateAnticipationRequest {
  agreementSignature: string;
  installment?: string | null;
  payment?: string;
}

/** Antecipação retornada pela API */
export interface Anticipation {
  id: string;
  dateCreated: string;
  payment?: string;
  installment?: string;
  value: number;
  status: string;
  [key: string]: unknown;
}

/** Parâmetros para listar antecipações */
export interface ListAnticipationsParams {
  payment?: string;
  installment?: string;
  status?: string;
  offset?: number;
  limit?: number;
}
