import { Address } from "hardhat-deploy/types";
import { AuctionNftContract } from "../typechain-types";

export const tokenURI =
  "ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json";

export async function mintNftToken(nftContract: AuctionNftContract, address: Address) {
  const trx = await nftContract.mintNft(address, tokenURI);
  const trxResult = await trx.wait(1);

  if (trxResult.events && trxResult.events[0].args) {
    return trxResult.events[0]?.args.tokenId.toString();
  }
  return null;
}
