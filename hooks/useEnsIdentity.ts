import { useEnsAvatar, useEnsName } from 'wagmi'
import { mainnet } from 'wagmi/chains'

export function useEnsIdentity(address: string | null) {
  const ensAddress = address ? (address as `0x${string}`) : undefined
  const { data: ensName } = useEnsName({
    address: ensAddress,
    chainId: mainnet.id,
  })
  const { data: ensAvatar } = useEnsAvatar({
    name: ensName ?? undefined,
    chainId: mainnet.id,
  })

  return {
    ensName: ensName ?? undefined,
    ensAvatar: ensAvatar ?? undefined,
  }
}
