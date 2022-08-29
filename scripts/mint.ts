import { ethers, network } from "hardhat";
import { moveBlocks } from "../utils/move-blocks";

const PRICE = ethers.utils.parseEther("0.1");

async function mintAndList() {
  const nftContract = await ethers.getContractAt(
    "AuctionNftContract",
    "0x83A7e66c40eB768B7873d2b7f33e3C71Af5217B4"
  );
  console.log("Minting NFT...");
  const mintTx = await nftContract.mintNft(
    "0x1D3021F4c178fAB923cF563dcC24c45d026B570C",
    "ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json"
  );
  const trxResult = await mintTx.wait(1);

  if (trxResult.events && trxResult.events[0].args) {
    console.log(
      `Minted tokenId ${trxResult.events[0].args.tokenId.toString()} from contract: ${
        nftContract.address
      }`
    );
    const marketplace = await ethers.getContractAt(
      "AuctionMarketplace",
      "0x0cBD6f6661569B25723c53029e28cA3D2732f143"
    );
    const addTx = await marketplace.addItemForSell(
      "0x83A7e66c40eB768B7873d2b7f33e3C71Af5217B4",
      trxResult.events[0].args.tokenId.toString(),
      ethers.utils.parseEther("0.0001")
    );
    const addTxResult = await addTx.wait(1);
    if (addTxResult.events && addTxResult.events[0].args) {
      console.log(addTxResult.events);
      console.log(`added tokenId ${addTxResult.events[0].args.tokenId.toString()}  to sale`);
    }
  }

  if (network.config.chainId == 31337) {
    await moveBlocks(2, 1000);
  }
}

mintAndList()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
