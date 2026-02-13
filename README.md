# asaas-sdk-node

SDK em **Node.js** (TypeScript/JavaScript) para integração com a **API Asaas v3**. Uso em **Express**, **NestJS** ou qualquer app Node.

- [Documentação Asaas](https://docs.asaas.com/reference/comece-por-aqui)
- API Key em [Minha Conta > Integração](https://www.asaas.com/config/index?tab=pushNotification) (produção) ou [Sandbox](https://sandbox.asaas.com).

## Instalação

```bash
npm install asaas-sdk-node
```

## Configuração

A API Key pode ser definida de duas formas (ou ambas; a config da instância tem prioridade):

### 1. Variáveis de ambiente

```env
ASAAS_API_KEY=sua_chave_api
ASAAS_ENV=sandbox
```

- `ASAAS_ENV`: `sandbox` ou `production` (padrão: `sandbox`).

### 2. Parâmetros na instância

```ts
import { AsaasClient } from 'asaas-sdk-node';

const client = new AsaasClient({
  apiKey: 'sua_chave_api',
  environment: 'sandbox', // ou 'production'
});

// Ou URL base customizada
const clientCustom = new AsaasClient({
  apiKey: 'sua_chave_api',
  baseUrl: 'https://www.asaas.com',
});
```

## Uso

### TypeScript / JavaScript (CommonJS)

```ts
const { AsaasClient } = require('asaas-sdk-node');

const asaas = new AsaasClient({ apiKey: process.env.ASAAS_API_KEY, environment: 'sandbox' });

// Clientes
const customer = await asaas.customers.create({
  name: 'João',
  cpfCnpj: '24971563792',
  email: 'joao@email.com',
});
const list = await asaas.customers.list({ limit: 10 });

// Cobranças
const payment = await asaas.payments.create({
  customer: customer.id,
  billingType: 'BOLETO',
  dueDate: '2025-12-31',
  value: 100,
  description: 'Pedido 001',
});
const pixQr = await asaas.payments.getPixQrCode(payment.id);
```

### Express

```ts
import express from 'express';
import { AsaasClient } from 'asaas-sdk-node';

const app = express();
const asaas = new AsaasClient(); // usa ASAAS_API_KEY e ASAAS_ENV do env

app.post('/clientes', async (req, res) => {
  try {
    const customer = await asaas.customers.create(req.body);
    res.json(customer);
  } catch (err) {
    res.status(err.status ?? 500).json({ error: err.message });
  }
});
```

### NestJS

Injete o `AsaasClient` onde precisar (ex.: factory com `ConfigService`):

```ts
import { AsaasClient } from 'asaas-sdk-node';

// No módulo ou provider
const asaas = new AsaasClient({
  apiKey: configService.get<string>('ASAAS_API_KEY'),
  environment: configService.get('ASAAS_ENV') ?? 'sandbox',
});
```

## Módulos

Esta seção é atualizada conforme novos serviços são implementados.

### ✅ Prontos

| Módulo | Acesso no client | Principais métodos |
|--------|------------------|--------------------|
| **Clientes** | `asaas.customers` | `create`, `getById`, `list`, `update`, `delete`, `restore` |
| **Cobranças** | `asaas.payments` | `create`, `getById`, `list`, `update`, `delete`, `restore`, `refund`, `getDigitableLine`, `getPixQrCode`, `receiveInCash`, `undoReceivedInCash` |
| **Antecipações** | `asaas.anticipations` | `simulate`, `create`, `getById`, `list` |
| **Parcelamentos** | `asaas.installments` | `getById`, `list`, `delete`, `refund` |
| **Notificações** | `asaas.notifications` | `update` |
| **Assinaturas** | `asaas.subscriptions` | `create`, `getById`, `list`, `listPayments`, `listInvoices`, `update`, `delete`, `createInvoiceSettings`, `getInvoiceSettings`, `updateInvoiceSettings`, `deleteInvoiceSettings` |
| **Transferências** | `asaas.transfers` | `createToBank`, `createToAsaas`, `getById`, `list` |
| **Webhooks** | `asaas.webhooks` | `getPayment`, `updatePayment`, `getInvoice`, `updateInvoice` |
| **Links de pagamento** | `asaas.paymentLinks` | `create`, `getById`, `list`, `update`, `delete`, `restore`, `addImage`, `listImages`, `getImage`, `deleteImage`, `setImageAsMain` |
| **Informações da conta** | `asaas.account` | `getCommercialInfo`, `updateCommercialInfo`, `getFees`, `getWallets`, `getPaymentCheckoutConfig`, `updatePaymentCheckoutConfig`, `updatePaymentCheckoutConfigFormData` |
| **Pix (chaves, QR estático, transações)** | `asaas.pix` | `createAddressKey`, `listAddressKeys`, `getAddressKeyById`, `deleteAddressKey`, `createStaticQrCode`, `listTransactions` |
| **Recuperações (negativações)** | `asaas.dunnings` | `create`, `simulate`, `listPaymentsAvailable`, `list`, `getById`, `cancel`, `resendDocuments`, `listHistory`, `listPartialPayments` |
| **Extrato** | `asaas.statement` | `list` |
| **Informações fiscais** | `asaas.fiscalInfo` | `get`, `getMunicipalOptions`, `createOrUpdate` |
| **Notas fiscais** | `asaas.invoices` | `list`, `getById`, `schedule`, `update`, `authorize`, `cancel`, `listMunicipalServices` |
| **Pagamento de contas** | `asaas.bills` | `list`, `getById`, `simulate`, `create`, `cancel` |
| **Contas Asaas (subcontas)** | `asaas.subAccounts` | `list`, `getById`, `create` |
| **Consulta Serasa** | `asaas.creditBureau` | `consult`, `getById`, `list` |


## Erros

Em falhas da API (4xx/5xx) é lançado `AsaasApiError` com `message`, `status` e `body` (quando houver):

```ts
import { AsaasApiError } from 'asaas-sdk-node';

try {
  await asaas.payments.getById('id_invalido');
} catch (err) {
  if (err instanceof AsaasApiError) {
    console.log(err.status, err.message, err.body);
  }
}
```

Em erros de **configuração** (ex.: apiKey ausente), é lançado `AsaasConfigError` (apenas `message`).

## Scripts do projeto

- `npm run build` – gera `dist/`
- `npm run test` – testes
- `npm run test:ci` – testes com cobertura (mín. 75%)
- `npm run lint` – ESLint
- `npm run format` – Prettier (escreve)
- `npm run format:check` – Prettier (apenas verifica)

## Contribuindo

- **Problemas ou pedidos de funcionalidade:** abra uma [issue](https://github.com/hallss93/asaas/issues) descrevendo o problema ou a sugestão, ou entre em contato por [e-mail](mailto:hallison.pm@gmail.com) ou [LinkedIn](https://www.linkedin.com/in/hallss93).
- **Correções e melhorias:** envie um [pull request](https://github.com/hallss93/asaas/compare). Faça um fork do repositório, crie uma branch para sua alteração e abra o PR referenciando a issue (se houver).

## Autor

**Hallison Melo** — Desenvolvedor Full Stack com foco em JavaScript/TypeScript, Node.js, Vue, React e React Native. Atua em frontend, backend e mobile.

- **E-mail:** [hallison.pm@gmail.com](mailto:hallison.pm@gmail.com)
- **GitHub:** [github.com/hallss93](https://github.com/hallss93/)
- **LinkedIn:** [linkedin.com/in/hallss93](https://www.linkedin.com/in/hallss93)

## Licença

MIT
