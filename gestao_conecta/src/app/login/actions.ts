'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.error('Supabase Login Error:', error)
    redirect('/login?error=invalid')
  }

  const cookieStore = await cookies()
  cookieStore.set('last_activity', Date.now().toString(), {
    path: '/',
    maxAge: 30 * 60,
    httpOnly: true,
    sameSite: 'lax',
  })

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  
  const cookieStore = await cookies()
  cookieStore.delete('last_activity')
  
  revalidatePath('/', 'layout')
  redirect('/login')
}
