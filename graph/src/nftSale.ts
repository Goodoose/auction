import { store } from "@graphprotocol/graph-ts";
import { ItemAddToSell, ItemBought, ItemRemoveFromSell } from "../generated/nftSale/nftSale";
import { nft, nftSale } from "../generated/schema";

export function handleItemAddToSell(event: ItemAddToSell): void {
  const eventParams = event.params;
  const token = nft.load(eventParams.tokenId.toString());

  if (!token) return;

  const tokenSale = new nftSale(eventParams.tokenId.toString());

  tokenSale.id = eventParams.nftAddress.toHexString();
  tokenSale.price = eventParams.price;
  tokenSale.token = eventParams.tokenId.toString();

  tokenSale.save();
}
export function handleItemBought(event: ItemBought): void {
  store.remove("nftSale", event.params.tokenId.toString());
}
export function handleItemRemoveFromSell(event: ItemRemoveFromSell): void {
  store.remove("nftSale", event.params.tokenId.toString());
}
