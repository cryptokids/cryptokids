import React, { useContext, useEffect } from 'react'
import { FinalExecutionStatus } from 'near-api-js/lib/providers/provider'
import { useLocation } from 'react-router'
import { toast } from 'react-toastify'
import { MintbaseContext } from '../contexts/mintbase'

const useQuery = () => {
  return new URLSearchParams(useLocation().search)
}

const CallbackWatcher: React.FC = () => {
  const { network } = useContext(MintbaseContext)
  const query = useQuery()

  useEffect(() => {
    const transactions = query.getAll('transactionHashes')
    if (network && network.mintbase && transactions.length > 0) {
      transactions.map(async (tx) => {
        const result = await network.mintbase.fetchTransactionResult(tx)
        console.log(result)
        if (result.error) {
          toast.error(result.error)
        } else if (
          (result.data.status as FinalExecutionStatus).SuccessValue != null
        ) {
          console.log('success tx', result.data)
          toast.success(`Transaction ${result.data.transaction.hash} successed`)
        }
        return result
      })
    }
  }, [])

  return <></>
}

export default CallbackWatcher
