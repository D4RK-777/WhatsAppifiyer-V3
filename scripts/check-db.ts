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
    // Test connection by attempting to get user session
    const { data: { user }, error } = await supabase.auth.getUser();
      
    if (error) throw error;
    
    console.log('✅ Successfully connected to Supabase!');
    if (user) {
      console.log('\n✅ Supabase connection successful! Found a user session.');
    } else {
      console.log('\n✅ Supabase connection successful! No active user session found (which is expected if not logged in).');
    }
    
  } catch (error) {
    if (error && typeof error === 'object' && 'name' in error && error.name === 'AuthSessionMissingError') {
      console.log('\n✅ Supabase connection successful! (Auth session missing, but connection established)');
      process.exit(0);
    } else {
      console.error('❌ Error connecting to Supabase:');
      console.error(error);
      process.exit(1);
    }
  }
}

checkDatabase();
