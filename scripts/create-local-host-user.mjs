import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Local host user setup failed. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY first.')
  process.exit(1)
}

const hostname = new URL(supabaseUrl).hostname
if (hostname !== '127.0.0.1' && hostname !== 'localhost') {
  console.error(`Local host user setup failed. Expected a local Supabase URL, got ${supabaseUrl}`)
  process.exit(1)
}

const email = process.env.QUIZZER_LOCAL_HOST_EMAIL ?? 'host@example.com'
const password = process.env.QUIZZER_LOCAL_HOST_PASSWORD ?? 'quizzer-local-password'
const fullName = process.env.QUIZZER_LOCAL_HOST_NAME ?? 'Local Host'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const signInResult = await supabase.auth.signInWithPassword({
  email,
  password,
})

if (!signInResult.error) {
  console.log(`Local host user is ready: ${email}`)
  process.exit(0)
}

const signUpResult = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      full_name: fullName,
    },
  },
})

if (signUpResult.error) {
  console.error(`Local host user setup failed. ${signUpResult.error.message}`)
  process.exit(1)
}

console.log(`Created local host user: ${email}`)
