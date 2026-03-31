import { generateNonce } from '@signinwithethereum/siwe'
import { getSession } from '@/lib/session'

export async function GET() {
  const session = await getSession()
  session.nonce = generateNonce()
  await session.save()

  return Response.json({ nonce: session.nonce })
}
