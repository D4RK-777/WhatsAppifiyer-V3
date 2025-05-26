import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

async function checkDatabase() {
  console.log('🔍 Checking database connection...');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase URL or key in environment variables');
    console.log('Make sure these are set in your .env file:');
    console.log('NEXT_PUBLIC_SUPABASE_URL=your-project-url');
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key');
    process.exit(1);
  }
  
  console.log('🔗 Connecting to Supabase...');
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Test connection by listing tables
    const { data: tables, error } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public');
      
    if (error) throw error;
    
    console.log('✅ Successfully connected to Supabase!');
    console.log('\n📋 Available tables:');
    tables.forEach(table => console.log(`- ${table.tablename}`));
    
  } catch (error) {
    console.error('❌ Error connecting to Supabase:');
    console.error(error);
    process.exit(1);
  }
}

checkDatabase();
