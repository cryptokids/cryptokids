/* This example requires Tailwind CSS v2.0+ */
import { Contract } from 'near-api-js'
import { useRecoilValue, useRecoilState } from 'recoil'
import { userState } from '../state/authentication'
import { greetingState } from '../state/greeting'
import { IContract, nearState } from '../state/near'
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
                <div className="bg-white dark:bg-gray-800 w-full mx-auto p-8 rounded-lg" >
                  {/* <img src="/icons/rocket.svg" className="h-10 w-10 mb-8 m-auto"/> */}
                  <p className="text-gray-600 dark:text-white w-full md:w-2/3 m-auto text-center text-lg md:text-3xl">
                      <span className="font-bold text-indigo-500">
                          “
                      </span>
                      {greeting}
                      <span className="font-bold text-indigo-500">
                          ”
                      </span>
                  </p>
                  <div className="flex items-center justify-center mt-8">
                      <a href="#" className="block relative">
                          <img alt="profil" 
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                          className="mx-auto object-cover rounded-full h-10 w-10 "/>
                      </a>
                      <div className="flex ml-2 items-center justify-center">
                          <span className="font-semibold text-indigo-500 mr-2 text-lg">
                            {userInfo.accountId}
                          </span>
                          <span className="text-gray-400 text-xl font-light">
                              /
                          </span>
                          <span className="text-gray-400 text-md ml-2">
                              User of CryptoKids
                          </span>
                      </div>
                  </div>
              </div>

              <div className="border-2 border-gray-200 rounded-lg h-full mt-2" >  
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
            </div>
          </div>
          {/* /End replace */}
        </div>
      </main>
      <main>

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