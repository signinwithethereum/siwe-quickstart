import { SiweMessage, SiweError } from '@signinwithethereum/siwe'
import { getSession } from '@/lib/session'
import '@/lib/siwe' // ensure SIWE is configured

export async function POST(request: Request) {
  const session = await getSession()
  const body = await request.json().catch(() => null)
  if (!body?.message || !body?.signature) {
    return Response.json(
      { error: 'Missing message or signature' },
      { status: 400 },
    )
  }
  const { message, signature } = body

  if (!session.nonce) {
    return Response.json({ error: 'No nonce in session' }, { status: 400 })
  }

  try {
    const siweMessage = new SiweMessage(message)

    const { data } = await siweMessage.verify({
      signature,
      domain: process.env.NEXT_PUBLIC_DOMAIN ?? new URL(request.url).host,
      nonce: session.nonce,
    })

    // Store verified identity in session
    session.address = data.address
    session.chainId = data.chainId
    session.nonce = undefined // invalidate nonce
    await session.save()

    return Response.json({ address: data.address, chainId: data.chainId })
  } catch (error) {
    if (error instanceof SiweError) {
      return Response.json({ error: error.type }, { status: 401 })
    }
    return Response.json({ error: 'Verification failed' }, { status: 400 })
  }
}
