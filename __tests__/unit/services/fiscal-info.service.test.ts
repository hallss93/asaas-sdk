import {
  FiscalInfoService,
  buildFiscalInfoFormData,
} from '../../../src/services/fiscal-info.service';
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

  it('createOrUpdateFormData sends POST multipart to /api/v3/fiscalInfo', async () => {
    const formData = new FormData();
    formData.append('email', 'fiscal@empresa.com');
    const response = { id: 'fisc_1', email: 'fiscal@empresa.com' };
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(response), { status: 200 }));
    const result = await service.createOrUpdateFormData(formData);
    expect(result.id).toBe('fisc_1');
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(init.method).toBe('POST');
    expect(init.body).toBeInstanceOf(FormData);
    const headers = init.headers as Record<string, string>;
    expect(headers['Content-Type']).toBeUndefined();
    expect(headers['access_token']).toBe('test_key');
  });

  it('buildFiscalInfoFormData maps fields and certificate buffer', async () => {
    const fd = buildFiscalInfoFormData({
      email: 'a@b.com',
      simplesNacional: false,
      culturalProjectsPromoter: true,
      rpsNumber: 1,
      certificateFile: { file: Buffer.from('pem'), filename: 'cert.pem' },
    });
    expect(fd.get('email')).toBe('a@b.com');
    expect(fd.get('simplesNacional')).toBe('false');
    expect(fd.get('culturalProjectsPromoter')).toBe('true');
    expect(fd.get('rpsNumber')).toBe('1');
    expect(fd.get('certificateFile')).toBeInstanceOf(Blob);
  });
});
