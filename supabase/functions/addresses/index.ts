// functions/addresses/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Token inválido' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { action, ...payload } = await req.json();

    console.log('🔵 Address Action:', action, 'User:', user.id);

    switch (action) {
      case 'getAddresses':
        return await getAddresses(supabaseClient, user.id);
      
      case 'createAddress':
        return await createAddress(supabaseClient, user.id, payload);
      
      case 'updateAddress':
        return await updateAddress(supabaseClient, user.id, payload);
      
      case 'deleteAddress':
        return await deleteAddress(supabaseClient, user.id, payload.id);
      
      case 'setDefaultAddress':
        return await setDefaultAddress(supabaseClient, user.id, payload.id);
      
      default:
        return new Response(JSON.stringify({ error: 'Ação não reconhecida' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('❌ Erro no endpoint de endereços:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Função para buscar endereços do usuário
async function getAddresses(supabaseClient: any, userId: string) {
  const { data, error } = await supabaseClient
    .from('user_addresses')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return new Response(JSON.stringify({ addresses: data }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Função para criar novo endereço
async function createAddress(supabaseClient: any, userId: string, addressData: any) {
  const { title, cep, street, number, neighborhood, complement, city, state, is_default } = addressData;

  // Se for definir como padrão, remove o padrão atual
  if (is_default) {
    await supabaseClient
      .from('user_addresses')
      .update({ is_default: false })
      .eq('user_id', userId)
      .eq('is_default', true);
  }

  const { data, error } = await supabaseClient
    .from('user_addresses')
    .insert([
      {
        user_id: userId,
        title: title || 'Principal',
        cep,
        street,
        number,
        neighborhood,
        complement,
        city,
        state,
        is_default: is_default || false
      }
    ])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return new Response(JSON.stringify({ address: data }), {
    status: 201,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Função para atualizar endereço
async function updateAddress(supabaseClient: any, userId: string, addressData: any) {
  const { id, ...updateData } = addressData;

  // Se for definir como padrão, remove o padrão atual
  if (updateData.is_default) {
    await supabaseClient
      .from('user_addresses')
      .update({ is_default: false })
      .eq('user_id', userId)
      .eq('is_default', true);
  }

  const { data, error } = await supabaseClient
    .from('user_addresses')
    .update(updateData)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return new Response(JSON.stringify({ address: data }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Função para deletar endereço
async function deleteAddress(supabaseClient: any, userId: string, addressId: string) {
  const { error } = await supabaseClient
    .from('user_addresses')
    .delete()
    .eq('id', addressId)
    .eq('user_id', userId);

  if (error) {
    throw error;
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Função para definir endereço como padrão
async function setDefaultAddress(supabaseClient: any, userId: string, addressId: string) {
  // Inicia transação para atualizar todos os endereços
  const { error: updateAllError } = await supabaseClient
    .from('user_addresses')
    .update({ is_default: false })
    .eq('user_id', userId);

  if (updateAllError) {
    throw updateAllError;
  }

  // Define o endereço específico como padrão
  const { data, error } = await supabaseClient
    .from('user_addresses')
    .update({ is_default: true })
    .eq('id', addressId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return new Response(JSON.stringify({ address: data }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}