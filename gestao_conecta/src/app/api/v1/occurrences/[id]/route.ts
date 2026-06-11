import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const apiKey = request.headers.get('x-api-key')
  
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing x-api-key header' }, { status: 401 })
  }

  // A Rota de API roda no lado do servidor, então é perfeitamente seguro usar a Service Role
  // para burlar o RLS e fazer operações administrativas (como validar chaves M2M).
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

  // Gerar o hash para bater com o banco
  const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex')

  // Buscar a chave no banco para pegar o prefeitura_id
  const { data: keyData, error: keyError } = await supabaseAdmin
    .from('api_keys')
    .select('prefeitura_id')
    .eq('key_hash', keyHash)
    .single()

  if (keyError || !keyData) {
    return NextResponse.json({ error: 'Invalid API Key' }, { status: 403 })
  }

  const prefeituraId = keyData.prefeitura_id;

  try {
    const { id } = await params;
    const body = await request.json()
    const { status } = body

    if (!status) {
      return NextResponse.json({ error: 'Missing status in body' }, { status: 400 })
    }

    // Atualiza o chamado, garantindo que pertence à prefeitura da API Key
    const { data: occurrence, error: updateError } = await supabaseAdmin
      .from('occurrences')
      .update({ status: status })
      .eq('id', id)
      .eq('prefeitura_id', prefeituraId)
      .select()
      .single()

    if (updateError || !occurrence) {
      console.error('M2M Update Error:', updateError);
      return NextResponse.json({ error: 'Occurrence not found or access denied' }, { status: 404 })
    }

    return NextResponse.json({ success: true, occurrence }, { status: 200 })

  } catch (err) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }
}
