import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

async function runMigration() {
  // Load environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase URL or key in environment variables');
  }

  // Initialize Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log('🚀 Starting database migration...');
    
    // Read the SQL file
    const migrationPath = join(process.cwd(), 'supabase', 'migrations', '20240524150000_create_feedback_tables.sql');
    const sql = readFileSync(migrationPath, 'utf8');
    
    // Execute the SQL
    console.log('📝 Executing SQL migration...');
    const { data, error } = await supabase.rpc('exec_sql', { query: sql });
    
    if (error) {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    }
    
    console.log('✅ Database migration completed successfully!');
    console.log('📊 Tables created:');
    console.log('   - message_feedback: Stores user feedback on AI messages');
    console.log('   - message_metadata: Stores additional metadata about messages');
    console.log('   - ai_training_data: View combining feedback and metadata');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ An error occurred during migration:', error);
    process.exit(1);
  }
}

runMigration();
