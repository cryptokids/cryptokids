import React from 'react'

type Props = {
  login: () => void
}

const Welcome: React.FC<Props> = ({ login }) => {
  return (
    <main>
      <h1>Welcome to CryptoKids!</h1>
      <p>
        CryptoKids is a non-profit project built on NEAR Protocol blockchain.
        You need to sign in to start using the app. The button below will sign
        you in using NEAR Wallet.
      </p>
      <p>The App is under development right now.</p>
      <p>Go ahead and click the button below to try it out:</p>
      <p style={{ textAlign: 'center', marginTop: '2.5em' }}>
        <button onClick={login}>Sign in</button>
      </p>
    </main>
  )
}

export default Welcome
