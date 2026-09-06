/**
 * API.js - Integração com o Supabase para a festa da Maria Eduarda
 */

const SUPABASE_URL = 'https://xemabibdpesndovuhvpn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlbWFiaWJkcGVzbmRvdnVodnBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg3MTMyMzksImV4cCI6MjEwNDI4OTIzOX0.qWi_OY8oB_FIuieJKwdOYB91661AWdkZlk6T93_lEew';

// Inicializa o cliente do Supabase se o SDK estiver carregado
let supabaseClient = null;
if (window.supabase && typeof window.supabase.createClient === 'function') {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
    console.warn('SDK do Supabase não foi encontrado.');
}

/* ==========================================================================
   FUNÇÕES DO MURAL DE MENSAGENS
   ========================================================================== */
async function apiBuscarMensagens() {
    if (!supabaseClient) return null;
    try {
        const { data, error } = await supabaseClient
            .from('mensagens')
            .select('*')
            .order('created_at', { ascending: true });
        
        if (error) {
            console.error('Erro ao buscar mensagens do Supabase:', error);
            return null;
        }
        return data;
    } catch (err) {
        console.error('Erro de conexão ao buscar mensagens:', err);
        return null;
    }
}

async function apiEnviarMensagem(nome, musica, mensagem) {
    if (!supabaseClient) return null;
    try {
        const { data, error } = await supabaseClient
            .from('mensagens')
            .insert([{ nome, musica, mensagem }])
            .select();
        
        if (error) {
            console.error('Erro ao salvar mensagem no Supabase:', error);
            throw error;
        }
        return data ? data[0] : null;
    } catch (err) {
        console.error('Erro de conexão ao enviar mensagem:', err);
        throw err;
    }
}

/* ==========================================================================
   FUNÇÕES DA GALERIA DE FOTOS
   ========================================================================== */
async function apiEnviarFoto(file) {
    if (!supabaseClient) return null;
    try {
        // Gerar um nome único para o arquivo
        const cleanName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        const fileName = `${Date.now()}_${cleanName}`;

        // 1. Upload do arquivo para o Storage Bucket 'fotos_festa'
        const { data: storageData, error: storageError } = await supabaseClient
            .storage
            .from('fotos_festa')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (storageError) {
            console.error('Erro no upload para o Storage:', storageError);
            throw storageError;
        }

        // 2. Pegar URL pública da foto
        const { data: publicUrlData } = supabaseClient
            .storage
            .from('fotos_festa')
            .getPublicUrl(fileName);

        const photoUrl = publicUrlData.publicUrl;

        // 3. Salvar o registro na tabela 'fotos'
        const { data, error: dbError } = await supabaseClient
            .from('fotos')
            .insert([{ url: photoUrl }])
            .select();

        if (dbError) {
            console.error('Erro ao registrar foto na tabela:', dbError);
            throw dbError;
        }

        return photoUrl;
    } catch (err) {
        console.error('Erro ao enviar foto para o Supabase:', err);
        throw err;
    }
}

async function apiBuscarFotos() {
    if (!supabaseClient) return null;
    try {
        const { data, error } = await supabaseClient
            .from('fotos')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Erro ao buscar fotos do Supabase:', error);
            return null;
        }
        return data.map(item => item.url);
    } catch (err) {
        console.error('Erro de conexão ao buscar fotos:', err);
        return null;
    }
}
