import { cookies } from 'next/headers'

export async function getLocale(): Promise<string> {
  const cookieStore = await cookies()
  return cookieStore.get('locale')?.value || 'en'
}
