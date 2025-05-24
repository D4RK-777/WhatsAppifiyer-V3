import { createClient } from '@supabase/supabase-js';

async function checkTables() {
  // Load environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase URL or key in environment variables');
    process.exit(1);
  }

  console.log('🔗 Connecting to Supabase...');
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Test the connection by listing all tables in the public schema
    console.log('📊 Fetching tables...');
    const { data: tables, error } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public');

    if (error) throw error;

    console.log('✅ Successfully connected to Supabase!');
    console.log('\n📋 Available tables:');
    
    if (tables && tables.length > 0) {
      tables.forEach(table => console.log(`   - ${table.tablename}`));
    } else {
      console.log('   No tables found in the public schema');
    }
    
    // Check if our target tables exist
    const targetTables = ['message_feedback', 'message_metadata'];
    const missingTables = targetTables.filter(
      table => !tables?.some(t => t.tablename === table)
    );

    if (missingTables.length > 0) {
      console.log('\n❌ Missing tables:');
      missingTables.forEach(table => console.log(`   - ${table}`));
    } else {
      console.log('\n✅ All expected tables exist!');
    }
    
  } catch (error: any) {
    console.error('❌ Error checking tables:', error?.message || 'Unknown error');
    if (error?.details) console.error('Details:', error.details);
    process.exit(1);
  }
}

checkTables();
