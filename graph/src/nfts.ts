import { Address, store } from "@graphprotocol/graph-ts";
import { Transfer, Transfer__Params } from "../generated/nfts/nfts";
import { nft, user } from "../generated/schema";

const EMPTY_ADDRESS = Address.fromHexString("0x0000000000000000000000000000000000000000");

export function handleTransfer(event: Transfer): void {
  const eventParams = event.params;

  if (eventParams.from.equals(EMPTY_ADDRESS)) {
    handleTokenMint(eventParams);
  } else if (eventParams.to.notEqual(EMPTY_ADDRESS)) {
    store.remove("nft", event.params.tokenId.toString());
  } else {
    handleTokenTransfer(eventParams);
  }
}

function handleTokenMint(eventParams: Transfer__Params): void {
  const token = new nft(eventParams.tokenId.toString());

  const ownerAddress = eventParams.to.toHexString();

  token.owner = token.ownerId = ownerAddress;

  token.save();
  isUserExists(ownerAddress);
}

function handleTokenTransfer(eventParams: Transfer__Params): void {
  const token = nft.load(eventParams.tokenId.toString());

  if (!token) return;

  const ownerAddress = eventParams.to.toHexString();

  token.owner = token.ownerId = ownerAddress;

  token.save();
  isUserExists(ownerAddress);
}

function isUserExists(userId: string): void {
  let currentUser = user.load(userId);

  if (!currentUser) {
    currentUser = new user(userId);
  }

  currentUser.save();
}
