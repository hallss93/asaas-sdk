/** Payload para criar/atualizar cliente */
export interface CreateCustomerRequest {
  name: string;
  email?: string;
  phone?: string;
  mobilePhone?: string;
  cpfCnpj: string;
  postalCode?: string;
  address?: string;
  addressNumber?: string;
  complement?: string;
  province?: string;
  externalReference?: string;
  notificationDisabled?: boolean;
  additionalEmails?: string;
  municipalInscription?: string;
  stateInscription?: string;
  observations?: string;
}

/** Atualização parcial de cliente (todos opcionais) */
export type UpdateCustomerRequest = Partial<CreateCustomerRequest>;

/** Cliente retornado pela API */
export interface Customer {
  id: string;
  dateCreated: string;
  name: string;
  email?: string;
  phone?: string;
  mobilePhone?: string;
  cpfCnpj: string;
  postalCode?: string;
  address?: string;
  addressNumber?: string;
  complement?: string;
  province?: string;
  externalReference?: string;
  notificationDisabled: boolean;
  additionalEmails?: string;
  municipalInscription?: string;
  stateInscription?: string;
  observations?: string;
  deleted?: boolean;
}
