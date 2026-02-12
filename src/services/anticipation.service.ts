import { BaseService } from './BaseService.js';
import type { PaginatedResponse } from '../types/common.js';
import type {
  Anticipation,
  CreateAnticipationRequest,
  ListAnticipationsParams,
  SimulateAnticipationRequest,
} from '../types/anticipation.js';

/** Serviço de Antecipações da API Asaas */
export class AnticipationService extends BaseService {
  constructor(http: import('../http/HttpClient.js').HttpClient) {
    super(http, '/anticipations');
  }

  /** Simular antecipação */
  async simulate(data: SimulateAnticipationRequest): Promise<Anticipation> {
    return this.http.post<Anticipation>(this.path('simulate'), data);
  }

  /** Solicitar antecipação (multipart quando houver documents) */
  async create(
    data: CreateAnticipationRequest,
    documents?: Array<{ file: Blob | Buffer; filename?: string }>
  ): Promise<Anticipation> {
    if (documents?.length) {
      const formData = new FormData();
      formData.append('agreementSignature', data.agreementSignature);
      if (data.installment != null) formData.append('installment', String(data.installment));
      if (data.payment) formData.append('payment', data.payment);
      documents.forEach((d, i) => {
        const blob = d.file instanceof Buffer ? new Blob([d.file]) : d.file;
        formData.append('documents', blob, d.filename ?? `document-${i}`);
      });
      return this.http.postMultipart<Anticipation>(this.path(), formData);
    }
    return this.http.post<Anticipation>(this.path(), data);
  }

  /** Recuperar uma única antecipação */
  async getById(id: string): Promise<Anticipation> {
    return this.http.get<Anticipation>(this.path(id));
  }

  /** Listar antecipações */
  async list(params?: ListAnticipationsParams): Promise<PaginatedResponse<Anticipation>> {
    const query = params as Record<string, string | number | undefined>;
    return this.http.get<PaginatedResponse<Anticipation>>(this.path(), query);
  }
}
