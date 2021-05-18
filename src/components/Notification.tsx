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
      <footer>
        <div>✔ Succeeded</div>
        <div>Just now</div>
      </footer>
    </aside>
  )
}

export default Notification
