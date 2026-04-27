import { headers } from 'next/headers'

export async function getURL(path = '/') {
  const headerStore = await headers()
  const origin = headerStore.get('origin')

  if (origin) {
    return new URL(path, origin).toString()
  }

  const host = headerStore.get('x-forwarded-host') ?? headerStore.get('host') ?? 'localhost:3000'
  const protocol = headerStore.get('x-forwarded-proto') ?? (host.includes('localhost') ? 'http' : 'https')

  return new URL(path, `${protocol}://${host}`).toString()
}
