/** @jest-environment node */
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/v1/occurrences/route';

// Mock the @supabase/supabase-js module
jest.mock('@supabase/supabase-js', () => {
  const mockSupabase = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
  };
  return {
    createClient: jest.fn(() => mockSupabase),
    __mockSupabase: mockSupabase, // expose for testing
  };
});

describe('M2M API /api/v1/occurrences', () => {
  let mockSupabase: any;

  beforeAll(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:8000';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockSupabase = require('@supabase/supabase-js').__mockSupabase;
  });

  it('should return 401 Unauthorized when x-api-key is missing', async () => {
    const req = new NextRequest('http://localhost/api/v1/occurrences', {
      method: 'POST',
      body: JSON.stringify({ description: 'test' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
    
    const json = await res.json();
    expect(json.error).toBe('Missing x-api-key header');
  });

  it('should return 403 Forbidden when x-api-key is invalid', async () => {
    mockSupabase.single.mockResolvedValue({ data: null, error: { message: 'Not found' } });

    const req = new NextRequest('http://localhost/api/v1/occurrences', {
      method: 'POST',
      headers: {
        'x-api-key': 'invalid-key'
      },
      body: JSON.stringify({ description: 'test' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(403);
    
    const json = await res.json();
    expect(json.error).toBe('Invalid API Key');
  });

  it('should return 403 Forbidden when x-api-key is inactive', async () => {
    mockSupabase.single.mockResolvedValue({ 
      data: { id: 'key-123', prefeitura_id: 'pref-1', is_active: false }, 
      error: null 
    });

    const req = new NextRequest('http://localhost/api/v1/occurrences', {
      method: 'POST',
      headers: {
        'x-api-key': 'inactive-key'
      },
      body: JSON.stringify({ description: 'test' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(403);
    
    const json = await res.json();
    expect(json.error).toBe('API Key is inactive');
  });

  it('should return 201 Created and process payload when x-api-key is valid', async () => {
    mockSupabase.single.mockResolvedValue({ 
      data: { id: 'key-123', prefeitura_id: 'pref-1', is_active: true }, 
      error: null 
    });

    const req = new NextRequest('http://localhost/api/v1/occurrences', {
      method: 'POST',
      headers: {
        'x-api-key': 'valid-key'
      },
      body: JSON.stringify({ title: 'Buraco na via', description: 'Rua X' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);
    
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.prefeitura_id).toBe('pref-1');
    expect(json.data.received_payload.title).toBe('Buraco na via');
  });
});
