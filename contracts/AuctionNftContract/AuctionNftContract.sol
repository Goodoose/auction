// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

error NotOwner();
error NotManager(string message);

contract AuctionNftContract is ERC721, ERC721Enumerable, ERC721URIStorage, ERC2981, AccessControl {
  address private mintManager;

  event TokenMinted(uint256 indexed tokenId);
  event TokenBurned(uint256 indexed tokenId);

  mapping(address => uint256[]) private nftsByOwner;

  constructor() ERC721("Token", "Tok") {
    mintManager = msg.sender;
  }

  function mintNft(address tokenOwner, string memory _uri) public isManager(msg.sender) {
    uint256 tokenIndex = totalSupply();
    _safeMint(tokenOwner, tokenIndex);
    _setTokenURI(tokenIndex, _uri);
    emit TokenMinted(tokenIndex);
    nftsByOwner[tokenOwner].push(tokenIndex);
  }

  modifier isManager(address sender) {
    require(sender == mintManager, "Only manager can mint nft token");
    _;
  }

  function deleteNft(uint256[] memory nfts, uint256 tokenId) internal pure {
    uint256 nftsLenght = nfts.length;

    for (uint256 i = 0; i < nftsLenght; i++) {
      if (nfts[i] == tokenId) {
        delete nfts[i];
      }
    }
  }

  function burnNft(uint256 tokenId) public isOwner(tokenId, msg.sender) isExists(tokenId) {
    _burn(tokenId);
    emit TokenBurned(tokenId);
    deleteNft(nftsByOwner[msg.sender], tokenId);
  }

  modifier isOwner(uint256 tokenId, address sender) {
    address owner = ownerOf(tokenId);
    require(sender == owner, "Only owner can burn nft token");
    _;
  }

  modifier isExists(uint256 tokenId) {
    _exists(tokenId);
    _;
  }

  function tokenURI(uint256 tokenId)
    public
    view
    override(ERC721, ERC721URIStorage)
    isExists(tokenId)
    returns (string memory)
  {
    return super.tokenURI(tokenId);
  }

  function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721, ERC721Enumerable, AccessControl, ERC2981)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal override(ERC721, ERC721Enumerable) {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
    super._burn(tokenId);
  }
}
