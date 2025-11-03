import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase 환경 변수가 설정되지 않았습니다.')
}

export function getSupabase() {
  if (!supabaseUrl || !supabaseAnonKey) {
    // 환경변수가 없으면 빈 클라이언트 반환하지 않고 null 반환
    // 대신 호출하는 쪽에서 처리하도록 함
    return null as any;
  }
  
  return createClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

