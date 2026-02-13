import { FiscalInfoService } from '../../../src/services/fiscal-info.service';
import { HttpClient } from '../../../src/http/HttpClient';

describe('FiscalInfoService', () => {
  let service: FiscalInfoService;
  let fetchMock: jest.SpyInstance;

  beforeEach(() => {
    const http = new HttpClient({
      baseUrl: 'https://sandbox.asaas.com',
      apiKey: 'test_key',
    });
    service = new FiscalInfoService(http);
    fetchMock = jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    fetchMock.mockRestore();
  });

  it('get sends GET to /api/v3/fiscalInfo', async () => {
    const response = {
      id: 'fisc_1',
      email: 'fiscal@empresa.com',
      municipalInscription: '123456',
      cnae: '6201501',
      taxRegime: 'SIMPLES',
    };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(response), { status: 200 }));
    const result = await service.get();
    expect(result.id).toBe('fisc_1');
    expect(result.email).toBe('fiscal@empresa.com');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/fiscalInfo'),
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('getMunicipalOptions sends GET to /api/v3/fiscalInfo/municipalOptions', async () => {
    const response = {
      authenticationType: 'TOKEN',
      supportsCancellation: true,
      usesSpecialTaxRegimes: true,
      usesServiceListItem: true,
      specialTaxRegimesList: [{ label: 'Simples Nacional', value: 'SIMPLES' }],
    };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(response), { status: 200 }));
    const result = await service.getMunicipalOptions();
    expect(result.authenticationType).toBe('TOKEN');
    expect(result.specialTaxRegimesList).toHaveLength(1);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/fiscalInfo/municipalOptions'),
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('createOrUpdate sends POST to /api/v3/fiscalInfo', async () => {
    const payload = {
      email: 'fiscal@empresa.com',
      municipalInscription: '123456',
      cnae: '6201501',
      taxRegime: 'SIMPLES',
    };
    const response = { id: 'fisc_1', ...payload };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(response), { status: 200 }));
    const result = await service.createOrUpdate(payload);
    expect(result.email).toBe('fiscal@empresa.com');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v3/fiscalInfo'),
      expect.objectContaining({ method: 'POST', body: JSON.stringify(payload) })
    );
  });
});
