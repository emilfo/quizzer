'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { isLocalSupabaseAuthEnabled } from '@/lib/auth-mode'
import { getURL } from '@/lib/utils'

const passwordAuthSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().trim().min(1).max(120).optional(),
})

export async function signInWithGoogle() {
  const supabase = await createClient()
  const redirectTo = await getURL('/auth/callback')

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
    },
  })

  if (error || !data.url) {
    redirect('/auth/error')
  }

  redirect(data.url)
}

export async function signInWithPassword(formData: FormData) {
  if (!isLocalSupabaseAuthEnabled()) {
    redirect('/auth/error')
  }

  const parsed = passwordAuthSchema.safeParse({
    email: String(formData.get('email') ?? '').trim(),
    password: String(formData.get('password') ?? ''),
  })

  if (!parsed.success) {
    redirect('/auth/error')
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)

  if (error) {
    redirect('/auth/error')
  }

  redirect('/host')
}

export async function signUpWithPassword(formData: FormData) {
  if (!isLocalSupabaseAuthEnabled()) {
    redirect('/auth/error')
  }

  const parsed = passwordAuthSchema.safeParse({
    email: String(formData.get('email') ?? '').trim(),
    password: String(formData.get('password') ?? ''),
    fullName: String(formData.get('fullName') ?? '').trim() || undefined,
  })

  if (!parsed.success) {
    redirect('/auth/error')
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.fullName ?? parsed.data.email,
      },
    },
  })

  if (error) {
    redirect('/auth/error')
  }

  redirect('/host')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
