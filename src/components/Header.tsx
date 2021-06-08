import React, { Fragment, useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline'

import { isLoggedInState, UserState } from '../state/authentication'

import logo from 'url:../assets/logo.png'
import avatar from 'url:../assets/kid-avatar.png'
import { MintbaseContext } from '../contexts/mintbase'

const navigation = [
  { name: 'Marketplace', link: '/marketplace', auth: false },
  { name: 'My Items', link: '/activity', auth: true },
  { name: 'Mint', link: '/dashboard', auth: true },
  { name: 'Charities', link: '/charities', auth: false },
]
const profile = ['Your Profile', 'My Items', 'Settings']

const UserSettings: React.FC<{ signOut: () => void }> = ({ signOut }) => {
  return (
    <Menu as="div" className="ml-3 relative">
      {({ open }) => (
        <>
          <div>
            <Menu.Button className="max-w-xs bg-white rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-yellow-800 focus:ring-white">
              <span className="sr-only">Open user menu</span>
              <img className="h-8 w-8 rounded-full" src={avatar} alt="" />
            </Menu.Button>
          </div>
          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              static
              className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              {profile.map((item) => (
                <Menu.Item key={item}>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-200"
                  >
                    {item}
                  </a>
                </Menu.Item>
              ))}
              <Menu.Item key={'Sign out'}>
                <a
                  onClick={signOut}
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-200"
                >
                  {'Sign out'}
                </a>
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  )
}

const AnonymousSettings: React.FC<{ signIn: () => void }> = ({ signIn }) => {
  return (
    <a
      onClick={signIn}
      href="#"
      className="text-gray-400 hover:text-white hover:bg-yellow-700 px-3 py-2 rounded-md text-sm font-medium"
    >
      {'Sign In'}
    </a>
  )
}

const MobileUserSettings: React.FC<{ signOut: () => void }> = ({ signOut }) => {
  return (
    <div className="pt-4 pb-3 border-t border-yellow-700">
      <div className="flex items-center px-5">
        <div className="flex-shrink-0">
          <img className="h-10 w-10 rounded-full" src={avatar} alt="" />
        </div>
        <div className="ml-3">
          <div className="text-base font-medium leading-none text-gray-600">
            Tom Cook
          </div>
          <div className="text-sm font-medium leading-none text-gray-600">
            tom@example.com
          </div>
        </div>
        <button
          className="ml-auto bg-white flex-shrink-0 p-1 rounded-full text-gray-600 hover:text-white hover:bg-yellow-700 
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-yellow-800 focus:ring-white"
        >
          <span className="sr-only">View notifications</span>
          <BellIcon className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      <div className="mt-3 px-2 space-y-1">
        {profile.map((item) => (
          <a
            key={item}
            href="#"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-white hover:bg-yellow-700"
          >
            {item}
          </a>
        ))}
        <a
          onClick={signOut}
          className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-white hover:bg-yellow-700"
          key="Sign out"
          href="#"
        >
          Sign out
        </a>
      </div>
    </div>
  )
}

const MobileAnonymousSettings: React.FC<{ signIn: () => void }> = ({
  signIn,
}) => {
  return (
    <div className="pt-4 pb-3 border-t border-yellow-700">
      <div className="mt-3 px-2 space-y-1">
        <a
          onClick={signIn}
          href="#"
          className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-white hover:bg-yellow-700"
        >
          {'Sign In'}
        </a>
      </div>
    </div>
  )
}

const Header: React.FC = () => {
  const { signIn, signOut } = useContext(MintbaseContext)
  const isLoggedIn = useRecoilValue(isLoggedInState)

  return (
    <div>
      <Disclosure as="nav" className="bg-white dark:bg-gray-800 shadow">
        {({ open }) => (
          <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img className="h-8 w-8" src={logo} alt="CryptoKids" />
                  </div>
                  <div className="w-auto px-4">
                    <a
                      className="text-xl text-gray-800 font-semibold font-heading"
                      href="/"
                    >
                      CryptoKids
                    </a>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-4">
                      {navigation.map((item) => {
                        if (item.auth && isLoggedIn != UserState.LogIn) {
                          return null
                        }
                        return (
                          <NavLink
                            key={item.link}
                            to={item.link}
                            className="text-gray-500  hover:text-gray-800 dark:hover:text-white px-3 py-2 rounded-md text-md font-medium"
                            activeClassName="text-gray-800 dark:text-white  hover:text-gray-800 dark:hover:text-white"
                          >
                            {item.name}
                          </NavLink>
                        )
                      })}
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="ml-4 flex items-center md:ml-6">
                    <button className="bg-white p-1 rounded-full text-gray-600 hover:text-grey-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-yellow-800 focus:ring-white">
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                    {/* Profile dropdown */}
                    {isLoggedIn == UserState.LogIn ? (
                      <UserSettings signOut={signOut} />
                    ) : (
                      <AnonymousSettings signIn={signIn} />
                    )}
                  </div>
                </div>
                <div className="-mr-2 flex md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-yellow-800 focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {navigation.map((item) => {
                  if (item.auth && isLoggedIn != UserState.LogIn) {
                    return null
                  }
                  return (
                    <NavLink
                      key={item.link}
                      to={item.link}
                      className="text-gray-500 hover:bg-yellow-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                      activeClassName="text-gray-800 dark:text-white  hover:text-white dark:hover:text-white"
                    >
                      {item.name}
                    </NavLink>
                  )
                })}
              </div>
              {/* Profile description */}
              {isLoggedIn == UserState.LogIn ? (
                <MobileUserSettings signOut={signOut} />
              ) : (
                <MobileAnonymousSettings signIn={signIn} />
              )}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  )
}

export default Header
