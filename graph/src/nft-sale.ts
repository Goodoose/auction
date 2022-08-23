import {
  ItemAddToSell as ItemAddToSellEvent,
  ItemBought as ItemBoughtEvent,
  ItemRemoveFromSell as ItemRemoveFromSellEvent
} from "../generated/NftSale/NftSale"
import {
  ItemAddToSell,
  ItemBought,
  ItemRemoveFromSell
} from "../generated/schema"

export function handleItemAddToSell(event: ItemAddToSellEvent): void {
  let entity = new ItemAddToSell(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.seller = event.params.seller
  entity.nftAddress = event.params.nftAddress
  entity.tokenId = event.params.tokenId
  entity.price = event.params.price
  entity.save()
}

export function handleItemBought(event: ItemBoughtEvent): void {
  let entity = new ItemBought(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.buyer = event.params.buyer
  entity.nftAddress = event.params.nftAddress
  entity.tokenId = event.params.tokenId
  entity.price = event.params.price
  entity.save()
}

export function handleItemRemoveFromSell(event: ItemRemoveFromSellEvent): void {
  let entity = new ItemRemoveFromSell(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.seller = event.params.seller
  entity.nftAddress = event.params.nftAddress
  entity.tokenId = event.params.tokenId
  entity.save()
}
