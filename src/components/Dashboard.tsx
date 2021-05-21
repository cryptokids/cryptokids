/* This example requires Tailwind CSS v2.0+ */
import { Contract } from 'near-api-js'
import { useRecoilValue, useRecoilState } from 'recoil'
import { userState } from '../state/authentication'
import { greetingState } from '../state/greeting'
import { IContract, nearState } from '../state/near'
import Footer from './Footer'
import GreetingForm from './GreetingForm'
import React, { useCallback, useEffect } from 'react'
import Notification from './Notification'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const Dashboard: React.FC = () => {
  const userInfo = useRecoilValue(userState)
  const { contract } = useRecoilValue(nearState)
  if (!userInfo || !contract) return null
  const [greeting, setGreeting] = useRecoilState(greetingState)
  const [showNotification, setShowNotification] = React.useState(false)

  const updateGreeting = useCallback(
    async (newGreeting) => {
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
    <div>

      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Replace with your content */}
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96" />
          </div>
          {/* /End replace */}
        </div>
      </main>
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
          {userInfo.accountId}
        </h1>
        <GreetingForm
          greeting={greeting}
          onSave={async (newGreeting) => {
            await updateGreeting(newGreeting)
            // show Notification
            setShowNotification(true)

            // remove Notification again after css animation completes
            // this allows it to be shown again next time the form is submitted
            setTimeout(() => {
              setShowNotification(false)
            }, 11000)
            return true
          }}
        ></GreetingForm>
        <Footer />
      </main>
      {showNotification && (
        <Notification
            accountId={userInfo.accountId}
            contractId={contract.contractId}
        />
        )}
    </div>

  )
}

export default Dashboard