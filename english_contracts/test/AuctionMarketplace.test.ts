import "@nomiclabs/hardhat-ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect, assert } from "chai";
import { ethers } from "hardhat";
import {
  AuctionMarketplace,
  AuctionMarketplace__factory,
  AuctionNftContract,
  AuctionNftContract__factory,
} from "../typechain-types";
import { mintNftToken } from "./utils";

describe("Marketplace Tests", function () {
  let marketplaceFactory: AuctionMarketplace__factory;
  let marketplaceDeploy: AuctionMarketplace;
  let marketplace: AuctionMarketplace;

  let nftContractFactory: AuctionNftContract__factory;
  let nftContractDeploy: AuctionNftContract;
  let nftContract: AuctionNftContract;

  const PRICE = ethers.utils.parseEther("0.1");
  let deployer: SignerWithAddress;
  let user: SignerWithAddress;

  beforeEach(async () => {
    const accounts = await ethers.getSigners();
    deployer = accounts[0];
    user = accounts[1];

    marketplaceFactory = await ethers.getContractFactory("AuctionMarketplace");
    marketplaceDeploy = await marketplaceFactory.deploy();
    marketplace = await marketplaceDeploy.connect(deployer);

    nftContractFactory = await ethers.getContractFactory("AuctionNftContract");
    nftContractDeploy = await nftContractFactory.deploy();
    nftContract = await nftContractDeploy.connect(deployer);
  });

  describe("AddItemForSell()", function () {
    it("Sender is not an owner", async function () {
      const tokenId = mintNftToken(nftContract, deployer.address);
      await expect(
        marketplace.connect(user).addItemForSell(nftContract.address, tokenId, PRICE)
      ).to.be.revertedWith(`NotOwner("${nftContract.address}")`);
    });

    it("Price should be not null", async function () {
      const tokenId = mintNftToken(nftContract, deployer.address);
      const nullPrice = ethers.utils.parseEther("0");
      await expect(
        marketplace.addItemForSell(nftContract.address, tokenId, nullPrice)
      ).to.be.revertedWith("PriceMustBeAboveZero()");
    });

    it("Item already added for sell", async function () {
      const tokenId = mintNftToken(nftContract, deployer.address);
      await marketplace.addItemForSell(nftContract.address, tokenId, PRICE);
      await expect(
        marketplace.addItemForSell(nftContract.address, tokenId, PRICE)
      ).to.be.revertedWith(`AlreadyAddedForSale("${nftContract.address}", 0)`);
    });

    it("emits an event", async function () {
      const tokenId = mintNftToken(nftContract, deployer.address);
      expect(await marketplace.addItemForSell(nftContract.address, tokenId, PRICE)).to.emit(
        marketplace,
        "ItemAddToSell"
      );
    });
  });

  describe("buyItem()", function () {
    it("Item is not added for sale", async function () {
      const tokenId = mintNftToken(nftContract, deployer.address);
      await expect(marketplace.buyItem(nftContract.address, tokenId)).to.be.revertedWith(
        `NotAddedForSale("${nftContract.address}", 0)`
      );
    });

    it("Price not met", async function () {
      const tokenId = mintNftToken(nftContract, deployer.address);
      await marketplace.addItemForSell(nftContract.address, tokenId, PRICE);
      await expect(marketplace.buyItem(nftContract.address, tokenId)).to.be.revertedWith(
        `PriceNotMet()`
      );
    });

    it("expect transfers the nft to the buyer ", async function () {
      const tokenId = mintNftToken(nftContract, deployer.address);
      await marketplace.addItemForSell(nftContract.address, tokenId, PRICE);
      await marketplace
        .attach(user.address)
        .buyItem(nftContract.address, tokenId, { value: PRICE });
      assert(user.address != (await nftContract.ownerOf(tokenId)));
      assert((await marketplace.getProceeds(deployer.address).toString()) != PRICE.toString());
    });

    it("emits an event", async function () {
      const tokenId = mintNftToken(nftContract, deployer.address);
      await marketplace.addItemForSell(nftContract.address, tokenId, PRICE);
      expect(
        await marketplace
          .attach(user.address)
          .buyItem(nftContract.address, tokenId, { value: PRICE })
      ).to.emit(marketplace, "ItemAddToSell");
    });
  });

  describe("removeItemFromSell()", function () {
    it("Sender is not an owner", async function () {
      const tokenId = mintNftToken(nftContract, deployer.address);
      await marketplace.addItemForSell(nftContract.address, tokenId, PRICE);
      await expect(
        marketplace.connect(user).removeItemFromSell(nftContract.address, tokenId)
      ).to.be.revertedWith(`NotOwner("${nftContract.address}")`);
    });

    it("Item is not added for sale", async function () {
      const tokenId = mintNftToken(nftContract, deployer.address);
      await expect(
        marketplace.removeItemFromSell(nftContract.address, tokenId)
      ).to.be.revertedWith(`NotAddedForSale("${nftContract.address}", 0)`);
    });

    it("emits an event", async function () {
      const tokenId = mintNftToken(nftContract, deployer.address);
      await marketplace.addItemForSell(nftContract.address, tokenId, PRICE);
      expect(await marketplace.removeItemFromSell(nftContract.address, tokenId)).to.emit(
        marketplace,
        "ItemRemoveFromSell"
      );
    });
  });
});
