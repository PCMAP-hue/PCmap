import { createClient } from '@supabase/supabase-js';

// Vercel 환경 변수 세팅 오류를 우회하기 위해 임시로 직접(하드코딩) 값을 넣습니다. 
// (NEXT_PUBLIC_ 변수는 브라우저에 노출되는 값이므로 이렇게 넣어도 보안상 큰 이슈는 없습니다)
const supabaseUrl = 'https://ebiejcteytqwqlbylriu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViaWVqY3RleXRxd3FsYnlscml1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxMTkwMzEsImV4cCI6MjA4ODY5NTAzMX0.myWRdYqDhGUUL6rJht8AO56aG-ek6WW0c4MJVu_N0Q0';

export const supabase = createClient(supabaseUrl, supabaseKey);
