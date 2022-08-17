// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// Import this file to use console.log
import "hardhat/console.sol";

error NotOwner();

contract NFTContract is ERC721 {
  uint256 private tokenCounter;
  address private mintManager;

  event TokenMinted(uint256 indexed tokenId);
  event TokenBurned(uint256 indexed tokenId);

  constructor() ERC721("Token", "Tok") {
    tokenCounter = 0;
    mintManager = msg.sender;
  }

  function mintNft() public isManager(msg.sender) {
    _safeMint(msg.sender, tokenCounter);
    emit TokenMinted(tokenCounter);
    tokenCounter += 1;
  }

  modifier isManager(address sender) {
    if (sender != mintManager) {
      revert NotOwner();
    }
    _;
  }

  function burnNft(address nftAddress, uint256 tokenId)
    public
    isOwner(nftAddress, tokenId, msg.sender)
  {
    _burn(tokenId);
    emit TokenBurned(tokenId);
  }

  modifier isOwner(
    address nftAddress,
    uint256 tokenId,
    address sender
  ) {
    IERC721 nft = IERC721(nftAddress);
    address owner = nft.ownerOf(tokenId);
    if (sender != owner) {
      revert NotOwner();
    }
    _;
  }
}
