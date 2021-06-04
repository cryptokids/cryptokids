import React, { useEffect, useState } from 'react'
import Card from '../components/Card'

import { useRecoilValue } from 'recoil'
import { IWallet, mintbaseContract, nearState } from '../state/near'
import { Attribute } from 'mintbase'

const Marketplace: React.FC = () => {
  const { mintbase } = useRecoilValue(nearState)
  const [things, setThings] = useState([] as any[])

  useEffect(() => {
    async function loadMarketplace(wallet: IWallet, storeId: string) {
      const {
        data: { store },
      } = await wallet.api!.fetchStoreById(storeId)
      const myStore = store.find((el: { id: string }) => el.id == storeId)
      Promise.all(
        myStore.things.map(async (t: { id: string }) => {
          const { data } = await wallet.api!.fetchThingMetadata(t.id)
          return data ? { ...t, thing: data } : null
        })
      ).then((result) => {
        console.log(result)
        setThings(result as any[])
      })
    }
    if (mintbase) {
      loadMarketplace(mintbase, mintbaseContract)
    }
  }, [])
  console.log(things)

  // TODO: Find a way to get price
  const getPrice = (x: any): number => {
    return 10
  }

  const getAuthor = (x: any): string => {
    return x.tokens[0].minter
  }

  return (
    <div className="grid place-items-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-5">
      {things.map(
        (item: {
          id: string
          thing: {
            title: string
            extra: Attribute[]
            media: { data: { uri: string } } | string
          }
        }) => {
          const extras =
            item.thing.extra != null && Array.isArray(item.thing.extra)
              ? item.thing.extra
              : []
          const charityId = extras.find(
            (c: Attribute) => c.trait_type === 'charityId'
          )

          return (
            <Card
              key={item.id}
              username={getAuthor(item)}
              charityId={
                charityId && charityId.value != null ? charityId.value! : '-'
              }
              title={item.thing.title}
              price={{ fraction: getPrice(item), token: 'NEAR' }}
              url={
                typeof item.thing.media === 'string'
                  ? item.thing.media
                  : item.thing.media.data.uri
              }
            ></Card>
          )
        }
      )}
    </div>
  )
}

export default Marketplace
