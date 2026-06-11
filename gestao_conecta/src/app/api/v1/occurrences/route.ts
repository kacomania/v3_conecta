import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Reusable validator function for testing
export async function validateApiKey(request: NextRequest): Promise<{ authorized: boolean; prefeituraId?: string; status: number; message?: string }> {
  const apiKey = request.headers.get('x-api-key');
  
  if (!apiKey) {
    return { authorized: false, status: 401, message: 'Missing x-api-key header' };
  }

  // Create a supabase service role client for querying api_keys table securely
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  
  if (!supabaseUrl || !supabaseKey) {
    return { authorized: false, status: 500, message: 'Internal server configuration error' };
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Hash the incoming key to compare with the database
  const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');

  const { data, error } = await supabase
    .from('api_keys')
    .select('id, prefeitura_id, is_active')
    .eq('key_hash', keyHash)
    .single();

  if (error || !data) {
    return { authorized: false, status: 403, message: 'Invalid API Key' };
  }

  if (!data.is_active) {
    return { authorized: false, status: 403, message: 'API Key is inactive' };
  }

  return { authorized: true, status: 200, prefeituraId: data.prefeitura_id };
}

export async function POST(request: NextRequest) {
  const validation = await validateApiKey(request);
  
  if (!validation.authorized) {
    return NextResponse.json({ error: validation.message }, { status: validation.status });
  }

  try {
    const payload = await request.json();
    
    // Simulate inserting the occurrence into the database
    // In a real scenario, we would use Supabase to insert into 'occurrences' table
    
    return NextResponse.json({
      success: true,
      message: 'Occurrence created successfully via M2M API',
      data: {
        prefeitura_id: validation.prefeituraId,
        received_payload: payload
      }
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }
}
