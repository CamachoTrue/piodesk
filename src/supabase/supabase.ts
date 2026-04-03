import { createClient } from '@supabase/supabase-js'
//Pa conectar con la base de datos
export const supabase = createClient('https://jzgglimnwoaxahogobff.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6Z2dsaW1ud29heGFob2dvYmZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwODM3MjEsImV4cCI6MjA4NzY1OTcyMX0.0przSoQMW6pWAwX2r4Ig4n5QaXOui4cdSKa53L2QCCc')  