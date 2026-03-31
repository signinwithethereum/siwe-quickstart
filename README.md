# SIWE Quickstart

A minimal [Sign in with Ethereum](https://siwe.xyz) app built with Next.js, wagmi, and viem.

## Setup

```bash
npm install
```

Copy the example env file and fill in your values:

```bash
cp .env.local.example .env.local
```

You'll need a [WalletConnect project ID](https://cloud.walletconnect.com) (free).

For production, set `NEXT_PUBLIC_DOMAIN` to your app's public hostname (e.g. `example.com`). This ensures SIWE domain verification matches the domain users see. Not needed for local development.

## Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — connect your wallet and sign in.

## License

MIT — [EthID.org](https://ethid.org)
