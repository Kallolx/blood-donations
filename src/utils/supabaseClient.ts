
import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = 'https://bfdxexkdwqrvlttzgevc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmZHhleGtkd3Fydmx0dHpnZXZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1ODUxODcsImV4cCI6MjA1ODE2MTE4N30.pmLofwtkFcFpDCDb4X3faaM9Jv7HPA3cUS6EimgOhzM';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
