import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { AuctionNftContract } from "../typechain-types";
import { mintNftToken, tokenURI } from "./utils";

describe("Nft contract tests", function () {
  let nftContract: AuctionNftContract;
  const PRICE = ethers.utils.parseEther("0.1");
  const TOKEN_ID = 0;
  let deployer: SignerWithAddress;
  let user: SignerWithAddress;

  beforeEach(async () => {
    const accounts = await ethers.getSigners();
    deployer = accounts[0];
    user = accounts[1];
    const nftContractFactory = await ethers.getContractFactory("AuctionNftContract");
    nftContract = await nftContractFactory.deploy();
  });

  describe("mintNft()", function () {
    it("Sender is not a manager", async function () {
      await expect(nftContract.connect(user).mintNft(user.address, tokenURI)).to.be.revertedWith(
        "Only manager can mint nft token"
      );
    });

    it("Successfully mint nft token for minter", async function () {
      const tokenId = mintNftToken(nftContract, deployer.address);
      expect(await nftContract.tokenURI(tokenId)).to.be.equal(tokenURI);
    });

    it("Successfully mint nft token for user", async function () {
      const tokenId = mintNftToken(nftContract, user.address);
      expect(await nftContract.tokenURI(tokenId)).to.be.equal(tokenURI);
    });
  });

  describe("burnNft()", function () {
    it("Sender is not an owner", async function () {
      const tokenId = mintNftToken(nftContract, deployer.address);
      await expect(nftContract.connect(user).burnNft(tokenId)).to.be.revertedWith(
        "Only owner can burn nft token"
      );
    });
    it("Token is not exist", async function () {
      await expect(nftContract.burnNft(1)).to.be.revertedWith("invalid token ID");
    });
    it("Token was deleted successfully", async function () {
      const tokenId = mintNftToken(nftContract, deployer.address);
      await nftContract.burnNft(tokenId);
      await expect(nftContract.burnNft(tokenId)).to.be.revertedWith("invalid token ID");
    });
  });
});
