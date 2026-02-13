/** Erro lançado quando a configuração do cliente é inválida (ex.: apiKey ou baseUrl ausente) */
export class AsaasConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AsaasConfigError';
    Object.setPrototypeOf(this, AsaasConfigError.prototype);
  }
}
