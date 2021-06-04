import React, { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { IAccount, IWallet, nearState } from '../state/near'
import Card from '../components/Card'

const ThingCard: React.FC<{ thing: any }> = ({ thing }) => {
  const extras = thing.extra != null ? JSON.parse(thing.extra) : {}
  return (
    <Card
      username={thing.accountId}
      charityId={extras.charity}
      title={thing.title}
      price={{ fraction: 1, token: 'NEAR' }}
      url={typeof thing.media === 'string' ? thing.media : thing.media.data.uri}
    ></Card>
  )
}

const MyMints: React.FC = () => {
  const { mintbase, account } = useRecoilValue(nearState)
  const [things, setThings] = useState([] as {}[])

  useEffect(() => {
    async function loadMarketplace(wallet: IWallet, account: IAccount) {
      const { data, error } = await wallet.api!.fetchAccount(account.accountId)
      if (error) {
        console.error(error)
        return
      }
      const { token } = data
      Promise.all(
        token.map(async (t: { thing: { id: string }; id: string }) => {
          console.log(t)
          const { data } = await wallet.api!.fetchThingMetadata(t.thing.id)
          return data
            ? { ...data, id: t.id, accountId: account.accountId }
            : null
        })
      ).then((result) => {
        console.log(result)
        setThings(result as any[])
      })

      console.log(token)
    }
    if (mintbase && account) {
      loadMarketplace(mintbase, account)
    }
  }, [setThings])

  return (
    <div className="grid place-items-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-5">
      {things.map((thing, idx) => {
        return <ThingCard key={`thing_${idx}`} thing={thing} />
      })}
    </div>
  )
}

export default MyMints
