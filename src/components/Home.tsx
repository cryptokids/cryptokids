import React, { useCallback, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useRecoilValue, useRecoilState } from 'recoil'
import { userState } from '../state/authentication'
import { greetingState } from '../state/greeting'
import { IContract, nearState } from '../state/near'
import Footer from './Footer'
import GreetingForm from './GreetingForm'
import { networkId } from '../foundation/near-utils'
import Layout from './Layout/Index'

const Home: React.FC = () => {
  const userInfo = useRecoilValue(userState)
  const { contract } = useRecoilValue(nearState)

  const [greeting, setGreeting] = useRecoilState(greetingState)

  const updateGreeting = useCallback(
    async (newGreeting) => {
      if (!userInfo || !contract) return
      if (
        await contract.setGreeting({
          accountId: userInfo.accountId,
          greeting: newGreeting,
        })
      ) {
        setGreeting(newGreeting)
      }
    },
    [setGreeting, userInfo]
  )

  useEffect(() => {
    if (!userInfo || !contract) return
    async function loadGreeting(contract: IContract) {
      if (!userInfo) return
      const greeting = await contract.getGreeting({
        accountId: userInfo.accountId,
      })
      setGreeting(greeting)
    }
    loadGreeting(contract)
  }, [setGreeting, userInfo])

  return (
    <Layout auth={true}>
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
        {userInfo?.accountId}
      </h1>
      <GreetingForm
        greeting={greeting}
        onSave={async (newGreeting) => {
          await updateGreeting(newGreeting)
          // show Notification
          toast(
            toastMessage({
              accountId: userInfo!.accountId,
              contractId: contract!.contractId,
            })
          )
          // setShowNotification(true)

          // remove Notification again after css animation completes
          // this allows it to be shown again next time the form is submitted
          setTimeout(() => {
            // setShowNotification(false)
          }, 11000)
          return true
        }}
      ></GreetingForm>
      <Footer />
    </Layout>
  )
}

const toastMessage = ({
  accountId,
  contractId,
}: {
  accountId: string
  contractId: string
}) => {
  const urlPrefix = `https://explorer.${networkId}.near.org/accounts`
  return (
    <React.Fragment>
      🦄{' '}
      <a target="_blank" rel="noreferrer" href={`${urlPrefix}/${accountId}`}>
        {accountId}
      </a>
      {
        ' ' /* React trims whitespace around tags; insert literal space character when needed */
      }
      called method: 'set_greeting' in contract:{' '}
      <a target="_blank" rel="noreferrer" href={`${urlPrefix}/${contractId}`}>
        {contractId}
      </a>
    </React.Fragment>
  )
}

export default Home
