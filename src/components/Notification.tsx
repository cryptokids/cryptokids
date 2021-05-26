import React from 'react'
import { networkId } from '../foundation/near-utils'

type Props = {
  accountId: string
  contractId: string
}

const Notification: React.FC<Props> = ({ accountId, contractId }) => {
  const urlPrefix = `https://explorer.${networkId}.near.org/accounts`
  return (
    <aside>
      <div className="p-2 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4 space-y-1">
        <div className="flex-shrink-0">
          <svg className="h-12 w-12 mt-4 m-auto text-green-500" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7">
              </path>
          </svg>
        </div>
        <div>
          <div className="text-xl font-medium text-black">Succeeded</div>
          <p className="text-gray-500">
            <a target="_blank" rel="noreferrer" className="underline hover:text-primary-gray-20" href={`${urlPrefix}/${accountId}`}>
              {accountId}
            </a>
            {
              ' ' /* React trims whitespace around tags; insert literal space character when needed */
            }
            called method: 'set_greeting' in contract:{' '}
            <a target="_blank" rel="noreferrer" className="underline hover:text-primary-gray-20" href={`${urlPrefix}/${contractId}`}>
              {contractId}
            </a>
          </p>
        </div>
      </div>
    </aside>
  )
}

export default Notification
