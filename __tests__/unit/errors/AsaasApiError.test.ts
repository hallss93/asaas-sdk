import { AsaasApiError } from '../../../src/errors/AsaasApiError';

describe('AsaasApiError', () => {
  it('is instance of Error', () => {
    const err = new AsaasApiError('msg', 400);
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(AsaasApiError);
  });

  it('has name AsaasApiError', () => {
    const err = new AsaasApiError('msg', 404);
    expect(err.name).toBe('AsaasApiError');
  });

  it('stores status and body', () => {
    const body = { errors: [{ code: 'x', description: 'y' }] };
    const err = new AsaasApiError('Invalid', 422, body);
    expect(err.status).toBe(422);
    expect(err.body).toEqual(body);
    expect(err.message).toBe('Invalid');
  });
});
