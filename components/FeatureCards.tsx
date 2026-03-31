export function FeatureCards() {
  return (
    <div className="features">
      <div className="feature-card">
        <h3>Wallet-Based Auth</h3>
        <p>
          Sign in with your Ethereum wallet. No passwords, no email
          verification, no third-party custody of your credentials.
        </p>
      </div>
      <div className="feature-card">
        <h3>Server-Side Verification</h3>
        <p>
          SIWE messages are verified on the server using the official library.
          Sessions are stored in encrypted, HTTP-only cookies.
        </p>
      </div>
      <div className="feature-card">
        <h3>ENS Integration</h3>
        <p>
          Resolves ENS names and avatars automatically. Your onchain identity
          carries over into the application.
        </p>
      </div>
    </div>
  )
}
