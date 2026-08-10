const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const bcrypt = require('bcryptjs');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  try {
    const passwordHash = bcrypt.hashSync('admin123', 10);
    const { data, error } = await supabase
      .from('users')
      .insert({
        email: 'admin@nextflow.com',
        username: 'admin',
        password_hash: passwordHash,
        role: 'admin',
      })
      .select('id, email, role')
      .single();

    if (error) {
      if (error.code === '42P01') {
        console.error('Table does not exist. Please run supabase/schema.sql in your Supabase SQL Editor.');
      } else {
        console.error('Error inserting admin:', error.message);
      }
    } else {
      console.log('Admin user created successfully:', data);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

main();
