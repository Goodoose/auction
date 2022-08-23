import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  ItemAddToSell,
  ItemBought,
  ItemRemoveFromSell
} from "../generated/NftSale/NftSale"

export function createItemAddToSellEvent(
  seller: Address,
  nftAddress: Address,
  tokenId: BigInt,
  price: BigInt
): ItemAddToSell {
  let itemAddToSellEvent = changetype<ItemAddToSell>(newMockEvent())

  itemAddToSellEvent.parameters = new Array()

  itemAddToSellEvent.parameters.push(
    new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller))
  )
  itemAddToSellEvent.parameters.push(
    new ethereum.EventParam(
      "nftAddress",
      ethereum.Value.fromAddress(nftAddress)
    )
  )
  itemAddToSellEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  itemAddToSellEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )

  return itemAddToSellEvent
}

export function createItemBoughtEvent(
  buyer: Address,
  nftAddress: Address,
  tokenId: BigInt,
  price: BigInt
): ItemBought {
  let itemBoughtEvent = changetype<ItemBought>(newMockEvent())

  itemBoughtEvent.parameters = new Array()

  itemBoughtEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )
  itemBoughtEvent.parameters.push(
    new ethereum.EventParam(
      "nftAddress",
      ethereum.Value.fromAddress(nftAddress)
    )
  )
  itemBoughtEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  itemBoughtEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )

  return itemBoughtEvent
}

export function createItemRemoveFromSellEvent(
  seller: Address,
  nftAddress: Address,
  tokenId: BigInt
): ItemRemoveFromSell {
  let itemRemoveFromSellEvent = changetype<ItemRemoveFromSell>(newMockEvent())

  itemRemoveFromSellEvent.parameters = new Array()

  itemRemoveFromSellEvent.parameters.push(
    new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller))
  )
  itemRemoveFromSellEvent.parameters.push(
    new ethereum.EventParam(
      "nftAddress",
      ethereum.Value.fromAddress(nftAddress)
    )
  )
  itemRemoveFromSellEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return itemRemoveFromSellEvent
}
