import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://hjftvsozcjdlilsruccj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqZnR2c296Y2pkbGlsc3J1Y2NqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4MjM5NTgsImV4cCI6MjA3ODM5OTk1OH0.UkjIWaYmsFzAjZD0j2txJGFjSv3D0XVF9ugLhE929-s';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Demo account credentials
const demoEmail = 'latief@email.com';
const demoPassword = 'zxcvbnm';

async function createDemoAccount() {
  console.log('Creating demo account...');
  console.log('Email:', demoEmail);

  try {
    const { data, error } = await supabase.auth.signUp({
      email: demoEmail,
      password: demoPassword,
      options: {
        emailRedirectTo: undefined,
        data: {
          demo_account: true
        }
      }
    });

    if (error) {
      if (error.message.includes('already registered')) {
        console.log('✓ Demo account already exists!');
        console.log('Email:', demoEmail);
        console.log('Password:', demoPassword);
        console.log('\nYou can now login with these credentials.');
        return;
      }
      throw error;
    }

    console.log('✓ Demo account created successfully!');
    console.log('\nAccount Details:');
    console.log('Email:', demoEmail);
    console.log('Password:', demoPassword);
    console.log('User ID:', data.user?.id);

    if (data.user?.email_confirmed_at) {
      console.log('\n✓ Email is already confirmed. You can login immediately.');
    } else {
      console.log('\n⚠ Note: Email confirmation may be required depending on Supabase settings.');
      console.log('Check your email for the confirmation link, or disable email confirmation in Supabase settings.');
    }

  } catch (error) {
    console.error('Error creating demo account:', error.message);
    process.exit(1);
  }
}

createDemoAccount();
