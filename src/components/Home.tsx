import React, { useContext } from 'react'
import { appStore } from '../state/app'
import { Wallet, Account, getGreating } from '../state/near'

type Props = {
  logout: () => void
  greeting: string
  accountId: string
}

const HomeInner: React.FC<Props> = ({ logout, greeting, accountId }) => {
  return (
    <React.Fragment>
      <button className="link" style={{ float: 'right' }} onClick={logout}>
        Sign out
      </button>
      <main>
        <h1>
          <label
            htmlFor="greeting"
            style={{
              color: 'var(--secondary)',
              borderBottom: '2px solid var(--secondary)',
            }}
          >
            {greeting}
          </label>
          {
            ' ' /* React trims whitespace around tags; insert literal space character when needed */
          }
          {accountId}!
        </h1>
      </main>
    </React.Fragment>
  )
}

const Home: React.FC = () => {
  const { state, dispatch, update } = useContext(appStore)

  const {
    account,
    contractAccount,
    // near,
    wallet,
    app: { greeting },
  }: // account,
  { account: Account; wallet: Wallet } = state

  dispatch(getGreating(contractAccount, account.accountId))

  return (
    <HomeInner
      logout={() => {
        wallet.signOut()
      }}
      greeting={greeting}
      accountId={account.accountId}
    />
  )
}

export default Home
