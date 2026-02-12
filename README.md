# Asaas SDK

SDK em Node.js para integração com a **API Asaas v3**. Funciona em **TypeScript** ou **JavaScript**, em projetos **Express**, **NestJS** ou qualquer aplicação Node.js.

- [Documentação Asaas](https://docs.asaas.com/reference/comece-por-aqui)
- API Key em [Minha Conta > Integração](https://www.asaas.com/config/index?tab=pushNotification) (produção) ou [Sandbox](https://sandbox.asaas.com).

## Instalação

```bash
npm install asaas-sdk
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
import { AsaasClient } from 'asaas-sdk';

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
const { AsaasClient } = require('asaas-sdk');

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
import { AsaasClient } from 'asaas-sdk';

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
import { AsaasClient } from 'asaas-sdk';

// No módulo ou provider
const asaas = new AsaasClient({
  apiKey: configService.get<string>('ASAAS_API_KEY'),
  environment: configService.get('ASAAS_ENV') ?? 'sandbox',
});
```

## Recursos disponíveis

- **Clientes**: `create`, `getById`, `list`, `update`, `delete`, `restore`
- **Cobranças**: `create`, `getById`, `list`, `update`, `delete`, `restore`, `refund`, `getDigitableLine`, `getPixQrCode`, `receiveInCash`, `undoReceivedInCash`

## Erros

Em falhas da API (4xx/5xx) é lançado `AsaasApiError` com `message`, `status` e `body` (quando houver):

```ts
import { AsaasApiError } from 'asaas-sdk';

try {
  await asaas.payments.getById('id_invalido');
} catch (err) {
  if (err instanceof AsaasApiError) {
    console.log(err.status, err.message, err.body);
  }
}
```

## Scripts do projeto

- `npm run build` – gera `dist/`
- `npm run test` – testes
- `npm run test:ci` – testes com cobertura (mín. 75%)
- `npm run lint` – ESLint
- `npm run format` – Prettier (escreve)
- `npm run format:check` – Prettier (apenas verifica)

## Licença

MIT
