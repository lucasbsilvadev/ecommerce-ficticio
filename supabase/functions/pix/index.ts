import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.51.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Verificar autenticação
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Token de autenticação necessário')
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
    if (authError || !user) throw new Error('Usuário não autenticado')

    if (req.method === 'POST') {
      const { amount, order_id } = await req.json()

      // Aqui você integraria com Mercado Pago ou outro gateway
      // Por enquanto, mock response
      const pixResponse = {
        id: `pix_${Date.now()}`,
        amount: amount,
        qr_code: "00020101021226860014br.gov.bcb.pix2552example.com/qr/v2/123456789520400005303986540540.005802BR5925MERCADOPAGOELETRONI6008BRASILIA62070503***6304ABCD",
        qr_code_text: "00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-426655440000520400005303986540540.005802BR5905LOJA6008BRASILIA61087007490062070503***6304A1B2",
        expiration_date: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutos
      }

      return new Response(
        JSON.stringify(pixResponse),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    }

    return new Response(
      JSON.stringify({ error: 'Método não permitido' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 405,
      },
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})