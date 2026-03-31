import { configure, createConfig } from '@signinwithethereum/siwe'

configure(
  await createConfig(process.env.ETH_RPC_URL || 'https://eth.llamarpc.com'),
)
