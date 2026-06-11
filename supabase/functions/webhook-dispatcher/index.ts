import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const payload = await req.json()
    const { type, table, record, old_record } = payload

    if (table !== 'occurrences' || !record) {
      return new Response(JSON.stringify({ message: "Ignored" }), { status: 200, headers: { "Content-Type": "application/json" } })
    }

    const prefeitura_id = record.prefeitura_id
    if (!prefeitura_id) {
      return new Response(JSON.stringify({ message: "No prefeitura_id" }), { status: 200, headers: { "Content-Type": "application/json" } })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data: webhooks, error } = await supabase
      .from('webhooks_endpoints')
      .select('url, secret_token')
      .eq('prefeitura_id', prefeitura_id)
      .eq('is_active', true)
      .limit(1)

    if (error || !webhooks || webhooks.length === 0) {
      console.log(`No active webhook for prefeitura: ${prefeitura_id}`)
      return new Response(JSON.stringify({ message: "No webhook configured" }), { status: 200, headers: { "Content-Type": "application/json" } })
    }

    const webhook = webhooks[0]

    try {
      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${webhook.secret_token}`
        },
        body: JSON.stringify({
          event: type,
          record: record,
          old_record: old_record,
          timestamp: new Date().toISOString()
        })
      })
      
      if (!response.ok) {
        console.error(`Webhook error: received status ${response.status} from ${webhook.url}`)
      } else {
        console.log(`Webhook successfully dispatched to ${webhook.url}`)
      }
    } catch (fetchError) {
      console.error(`Webhook dispatch failed (timeout/network):`, fetchError)
    }

    return new Response(JSON.stringify({ message: "Dispatched" }), { status: 200, headers: { "Content-Type": "application/json" } })
  } catch (err) {
    console.error("Internal Function Error:", err)
    return new Response(JSON.stringify({ message: "Error handled gracefully" }), { status: 200, headers: { "Content-Type": "application/json" } })
  }
})
