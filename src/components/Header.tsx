import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline'
import { SignInLink, SignOutLink } from './AuthProvider'
import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { isLoggedInState, UserState } from '../state/authentication'

const navigation = [
  { name: 'Marketplace', link: '/marketplace' },
  { name: 'Dashboard', link: '/dashboard' },
  { name: 'Activity', link: '/activity' },
  { name: 'Charities', link: '/charities' },
]
const profile = ['Your Profile', 'My Items', 'Settings']

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const UserSettings: React.FC = () => {
  return (
    <Menu as="div" className="ml-3 relative">
      {({ open }) => (
        <>
          <div>
            <Menu.Button className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
              <span className="sr-only">Open user menu</span>
              <img
                className="h-8 w-8 rounded-full"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
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
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {item}
                  </a>
                </Menu.Item>
              ))}
              <Menu.Item key={'Sign out'}>
                <SignOutLink>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {'Sign out'}
                  </a>
                </SignOutLink>
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  )
}

const AnonymousSettings: React.FC = () => {
  return (
    <SignInLink>
      <a
        href="#"
        className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
      >
        {'Sign In'}
      </a>
    </SignInLink>
  )
}

const MobileUserSettings: React.FC = () => {
  return (
    <div className="pt-4 pb-3 border-t border-gray-700">
      <div className="flex items-center px-5">
        <div className="flex-shrink-0">
          <img
            className="h-10 w-10 rounded-full"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt=""
          />
        </div>
        <div className="ml-3">
          <div className="text-base font-medium leading-none text-white">
            Tom Cook
          </div>
          <div className="text-sm font-medium leading-none text-gray-400">
            tom@example.com
          </div>
        </div>
        <button className="ml-auto bg-gray-800 flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
          <span className="sr-only">View notifications</span>
          <BellIcon className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      <div className="mt-3 px-2 space-y-1">
        {profile.map((item) => (
          <a
            key={item}
            href="#"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
          >
            {item}
          </a>
        ))}
        <SignOutLink>
          <a
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
            key="Sign out"
            href="#"
          >
            Sign out
          </a>
        </SignOutLink>
      </div>
    </div>
  )
}

const MobileAnonymousSettings: React.FC = () => {
  return (
    <div className="pt-4 pb-3 border-t border-gray-700">
      <div className="mt-3 px-2 space-y-1">
        <SignInLink>
          <a
            href="#"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
          >
            {'Sign In'}
          </a>
        </SignInLink>
      </div>
    </div>
  )
}

const Header: React.FC = () => {
  // const setUserState = useSetRecoilState(isLoggedInState)
  const loggedInState = useRecoilValue(isLoggedInState)
  console.log(loggedInState)

  return (
    <div>
      <Disclosure as="nav" className="bg-gray-800">
        {({ open }) => (
          <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img
                      className="h-8 w-8"
                      src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
                      alt="CryptoKids"
                    />
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-4">
                      {navigation.map((item) => (
                        <NavLink
                          key={item.link}
                          to={item.link}
                          className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                          activeClassName="bg-gray-900 text-white hover:bg-gray-900"
                        >
                          {item.name}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="ml-4 flex items-center md:ml-6">
                    <button className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                    {/* Profile dropdown */}
                    {loggedInState == UserState.LogIn ? (
                      <UserSettings />
                    ) : (
                      <AnonymousSettings />
                    )}
                  </div>
                </div>
                <div className="-mr-2 flex md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
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
                {navigation.map((item) => (
                  <NavLink
                    key={item.link}
                    to={item.link}
                    className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    activeClassName="bg-gray-900 text-white hover:bg-gray-900"
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
              {/* Profile description */}
              {loggedInState == UserState.LogIn ? (
                <MobileUserSettings />
              ) : (
                <MobileAnonymousSettings />
              )}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  )
}

export default Header
