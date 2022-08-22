// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

error NotOwner(address nftAddress);
error PriceMustBeAboveZero();
error NotApprovedForMarketplace();
error AlreadyAddedForSale(address nftAddress, uint256 tokenId);
error NotAddedForSale(address nftAddress, uint256 tokenId);
error PriceNotMet();

contract AuctionMarketplace is ReentrancyGuard {
  struct ItemForSell {
    uint256 price;
    address seller;
    uint256 tokenId;
  }

  event ItemAddToSell(
    address indexed seller,
    address indexed nftAddress,
    uint256 indexed tokenId,
    uint256 price
  );

  event ItemRemoveFromSell(
    address indexed seller,
    address indexed nftAddress,
    uint256 indexed tokenId
  );

  event ItemBought(
    address indexed buyer,
    address indexed nftAddress,
    uint256 indexed tokenId,
    uint256 price
  );

  mapping(address => mapping(uint256 => ItemForSell)) private items;
  mapping(address => uint256) private proceeds;

  modifier isOwner(
    address nftAddress,
    uint256 tokenId,
    address sender
  ) {
    IERC721 nft = IERC721(nftAddress);
    address owner = nft.ownerOf(tokenId);
    if (sender != owner) {
      revert NotOwner(nftAddress);
    }
    _;
  }

  modifier notForSell(address nftAddress, uint256 tokenId) {
    if (items[nftAddress][tokenId].price > 0) {
      revert AlreadyAddedForSale(nftAddress, tokenId);
    }
    _;
  }

  modifier isForSell(address nftAddress, uint256 tokenId) {
    if (items[nftAddress][tokenId].price <= 0) {
      revert NotAddedForSale(nftAddress, tokenId);
    }
    _;
  }

  function addItemForSell(
    address nftAddress,
    uint256 tokenId,
    uint256 price
  ) external isOwner(nftAddress, tokenId, msg.sender) notForSell(nftAddress, tokenId) {
    if (price <= 0) {
      revert PriceMustBeAboveZero();
    }
    items[nftAddress][tokenId] = ItemForSell(price, msg.sender, tokenId);
    emit ItemAddToSell(msg.sender, nftAddress, tokenId, price);
  }

  function removeItemFromSell(address nftAddress, uint256 tokenId)
    external
    isOwner(nftAddress, tokenId, msg.sender)
    isForSell(nftAddress, tokenId)
  {
    delete (items[nftAddress][tokenId]);
    emit ItemRemoveFromSell(msg.sender, nftAddress, tokenId);
  }

  function buyItem(address nftAddress, uint256 tokenId)
    external
    payable
    nonReentrant
    isForSell(nftAddress, tokenId)
  {
    ItemForSell memory item = items[nftAddress][tokenId];
    if (item.price > msg.value) {
      revert PriceNotMet();
    }
    proceeds[item.seller] += msg.value;
    IERC721(nftAddress).safeTransferFrom(item.seller, msg.sender, tokenId);
    delete (items[nftAddress][tokenId]);
    emit ItemBought(msg.sender, nftAddress, tokenId, item.price);
  }

  function getItems(address nftAddress, uint256 tokenId)
    external
    view
    returns (ItemForSell memory)
  {
    return items[nftAddress][tokenId];
  }

  function getProceeds(address seller) external view returns (uint256) {
    return proceeds[seller];
  }
}
