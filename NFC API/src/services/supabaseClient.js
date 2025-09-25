const { createClient } = require('@supabase/supabase-js');

let cachedClient = null;

function getSupabaseConfig() {
	const url = process.env.SUPABASE_URL || 'https://iwimyejbwedasqzmnsnb.supabase.co';
	const anonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3aW15ZWpid2VkYXNxem1uc25iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5MTc1MzIsImV4cCI6MjA3MzQ5MzUzMn0.iZ4oQKXnyGEMjY38Ptpj50mJP5C2AA-Ngn4CN3IVTO4';
	return { url, anonKey };
}

function getSupabaseClient() {
	if (cachedClient) return cachedClient;
	const { url, anonKey } = getSupabaseConfig();
	if (!url || !anonKey) return null;
	cachedClient = createClient(url, anonKey, {
		autoRefreshToken: true,
		persistSession: false
	});
	return cachedClient;
}

module.exports = { getSupabaseClient };


