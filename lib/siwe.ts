import { configure, createConfig } from '@signinwithethereum/siwe'

const configured = configure(
	await createConfig(process.env.ETH_RPC_URL || 'https://eth.llamarpc.com')
)

export { configured }
