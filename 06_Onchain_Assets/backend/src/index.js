import cors from 'cors'
import express from 'express'
import Session from 'express-session'
import { generateNonce, SiweMessage } from 'siwe'
import { ethers } from 'ethers'

const app = express()
app.use(express.json())
app.use(
	cors({
		origin: 'http://localhost:8080',
		credentials: true,
	})
)

app.use(
	Session({
		name: 'siwe-quickstart',
		secret: 'siwe-quickstart-secret',
		resave: true,
		saveUninitialized: true,
		cookie: { secure: false, sameSite: true },
	})
)

app.get('/nonce', async function (req, res) {
	req.session.nonce = generateNonce()
	res.setHeader('Content-Type', 'text/plain')
	res.status(200).send(req.session.nonce)
})

app.post('/verify', async function (req, res) {
	try {
		if (!req.body.message) {
			res.status(422).json({
				message: 'Expected prepareMessage object as body.',
			})
			return
		}

		let SIWEObject = new SiweMessage(req.body.message)
		const { data: message } = await SIWEObject.verify({
			signature: req.body.signature,
			nonce: req.session.nonce,
		})

		req.session.siwe = message

		if (message.expirationTime) {
			req.session.cookie.expires = new Date(message.expirationTime)
		}

		req.session.save(() => res.status(200).send(true))
	} catch (e) {
		req.session.siwe = null
		req.session.nonce = null
		console.error(e)
		switch (e) {
			case 'expired_message': {
				req.session.save(() =>
					res.status(440).json({ message: e.message })
				)
				break
			}
			case 'invalid_signature': {
				req.session.save(() =>
					res.status(422).json({ message: e.message })
				)
				break
			}
			default: {
				req.session.save(() =>
					res.status(500).json({ message: e.message })
				)
				break
			}
		}
	}
})

app.get('/personal_information', function (req, res) {
	if (!req.session.siwe) {
		res.status(401).json({ message: 'You have to first sign_in' })
		return
	}
	console.log('User is authenticated!')
	res.setHeader('Content-Type', 'text/plain')
	res.send(
		`You are authenticated and your address is: ${req.session.siwe.address}`
	)
})

// Endpoint to get token balances for authenticated user
app.get('/tokens/:address', async function (req, res) {
	if (!req.session.siwe) {
		res.status(401).json({ message: 'You have to first sign_in' })
		return
	}

	const { address } = req.params
	const { chainId } = req.query

	try {
		// Using public RPC endpoints for demo purposes
		// In production, use dedicated providers like Alchemy, Infura, etc.
		const provider = new ethers.JsonRpcProvider(
			'https://eth-mainnet.public.blastapi.io'
		)

		// Get ETH balance
		const ethBalance = await provider.getBalance(address)
		const ethBalanceFormatted = ethers.formatEther(ethBalance)

		// For ERC-20 tokens, you would need to query specific token contracts
		// This is a simplified example showing ETH balance
		const tokens = [
			{
				name: 'Ethereum',
				symbol: 'ETH',
				balance: ethBalanceFormatted,
				decimals: 18,
				contractAddress: 'native',
			},
		]

		res.json({ tokens })
	} catch (error) {
		console.error('Error fetching tokens:', error)
		res.status(500).json({ error: 'Failed to fetch token balances' })
	}
})

// Endpoint to get NFTs for authenticated user
app.get('/nfts/:address', async function (req, res) {
	if (!req.session.siwe) {
		res.status(401).json({ message: 'You have to first sign_in' })
		return
	}

	const { address } = req.params
	const { chain } = req.query

	try {
		// Using OpenSea API as in the original implementation
		const chainParam = chain || 'ethereum'
		const response = await fetch(
			`https://testnets-api.opensea.io/api/v2/chain/${chainParam}/account/${address}/nfts`
		)

		if (!response.ok) {
			throw new Error(response.statusText)
		}

		const data = await response.json()
		res.json(data)
	} catch (error) {
		console.error('Error fetching NFTs:', error)
		res.status(500).json({ error: 'Failed to fetch NFTs' })
	}
})

app.listen(3000)
