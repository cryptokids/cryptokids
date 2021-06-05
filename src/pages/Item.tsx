import React, { useEffect, useState } from 'react'
import Card from '../components/Card'
import { useRecoilValue } from 'recoil'
import { Attribute, MintMetadata } from 'mintbase'
import { IWallet, mintbaseContract, nearState } from '../state/near'

const Item: React.FC = () => {
  const { mintbase } = useRecoilValue(nearState)
  const [item, setItem] = useState(null as MintMetadata | null)
  const itemId = '1'

  useEffect(() => {
    async function loadItem(wallet: IWallet, storeId: string, itemId: string) {
      //   const {
      //     data: { store },
      //   } = await wallet.api!.fetchStoreById(storeId)
      // const myStore = store.find((el: { id: string }) => el.id == storeId)
      const { data } = await wallet.api!.fetchThingMetadata(itemId)
      console.log(data)

      setItem(data)
    }
    if (mintbase) {
      loadItem(mintbase, mintbaseContract, itemId)
    }
  }, [setItem])

  console.log(item)

  const getAuthor = (x: any): string => {
    return x.tokens[0].minter
  }

  const extras =
    item?.extra != null && Array.isArray(item.extra) ? item.extra : []
  const charityId = extras.find((c: Attribute) => c.trait_type === 'charityId')

  const getPrice = (x: any): number => {
    return 10
  }

  return (
    <div>
      {item != null && (
        <Card
          key={item.id}
          username={getAuthor(item)}
          charityId={
            charityId && charityId.value != null ? charityId.value! : '-'
          }
          title={item.title}
          price={{ fraction: getPrice(item), token: 'NEAR' }}
          url={
            typeof item.media === 'string' ? item.media : item.media.data.uri
          }
        ></Card>
      )}
    </div>
  )
}

export default Item
