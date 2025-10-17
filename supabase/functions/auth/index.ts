import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, email, password, full_name } = await req.json()

    // LOGIN
    if (action === 'login') {
      const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError

      // Buscar perfil do usuário
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single()

      if (profileError) throw profileError

      return new Response(
        JSON.stringify({ 
          success: true, 
          user: {
            id: authData.user.id,
            email: authData.user.email,
            full_name: profile.full_name,
            role: profile.role
          },
          token: authData.session.access_token
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    // REGISTER
    if (action === 'register') {
      // Registrar usuário no Auth
      const { data: authData, error: authError } = await supabaseAdmin.auth.signUp({
        email,
        password,
      })

      if (authError) throw authError

      if (!authData.user) {
        throw new Error('Falha ao criar usuário')
      }

      // Criar perfil - usando upsert para evitar duplicatas
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .upsert({
          id: authData.user.id,
          email: email,
          full_name: full_name || '',
          role: 'customer'
        }, {
          onConflict: 'id'
        })

      if (profileError) throw profileError

      // Buscar perfil criado
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single()

      return new Response(
        JSON.stringify({ 
          success: true, 
          user: {
            id: authData.user.id,
            email: authData.user.email,
            full_name: profile?.full_name || full_name,
            role: profile?.role || 'customer'
          },
          token: authData.session?.access_token,
          message: 'Usuário criado com sucesso!' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    // GET PROFILE
    if (action === 'getProfile') {
      const authHeader = req.headers.get('Authorization')
      if (!authHeader) {
        throw new Error('Token de autenticação não fornecido')
      }

      const token = authHeader.replace('Bearer ', '')
      
      // Verificar token
      const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
      if (authError) throw authError

      // Buscar perfil
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError) throw profileError

      return new Response(
        JSON.stringify({ 
          success: true, 
          user: {
            id: user.id,
            email: user.email,
            full_name: profile.full_name,
            role: profile.role
          }
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    // LOGOUT
    if (action === 'logout') {
      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'Logout realizado com sucesso'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    throw new Error('Ação não reconhecida')

  } catch (error) {
    console.error('Auth function error:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})