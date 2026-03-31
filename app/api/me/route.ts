import { getSession } from '@/lib/session'

export async function GET() {
  const session = await getSession()

  if (!session.address) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 })
  }

  return Response.json({ address: session.address, chainId: session.chainId })
}
