import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyAdminToken, COOKIE_NAME } from '@/lib/admin-auth'
import AdminLoginForm from './login-form'

export default async function AdminPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (token && verifyAdminToken(token)) {
    redirect('/admin/profesores')
  }
  return <AdminLoginForm />
}
