import { useState, useEffect, useContext } from "react";
import { useQuery, gql } from "@apollo/client";
import { ethers, BigNumber } from "ethers";
import { Button } from "react-bootstrap";

import { useMetamask } from "use-metamask";
import { useAsyncAction } from "./hooks/use-async-action";

import { ContractContext } from "./App";

import "./Items.css";

type Nft = {
  id: string;
};

type NftSale = {
  id: string;
  price: BigNumber;
  token: {
    ownerId: string;
  };
};

export default function Items() {
  const [nfts, setNfts] = useState<Nft[]>([]);
  const [nftSales, setNftSales] = useState<NftSale[]>([]);
  const { nftContract, marketplace, signer } = useContext(ContractContext);

  const { isLoading, runAsyncAction } = useAsyncAction();
  const { metaState } = useMetamask();

  const { loading, error, data } = useQuery(
    gql`
      query ($first: Int, $owner: String) {
        nfts(first: $first, where: { ownerId: $owner }) {
          id
        }
        nftSales(first: $first, where: { token_: { ownerId: $owner } }) {
          id
          token {
            id
          }
          price
        }
      }
    `,
    {
      variables: { first: 100, owner: metaState.account[0]?.toLowerCase() },
    }
  );

  if (error) {
    console.log(error.message);
  }

  useEffect(() => {
    if (data) {
      const { nfts, nftSales }: { nfts: Nft[]; nftSales: NftSale[] } = data;
      setNfts(nfts);
      setNftSales(nftSales);
    }
  }, [data]);

  const handleItemRemoveFromSell = (tokenId: string) => {
    runAsyncAction(async () => {
      await marketplace.connect(signer).removeItemFromSell(nftContract.address, tokenId);
    });
  };

  const handleItemAddToSell = (tokenId: string) => {
    runAsyncAction(
      async () => {
        await nftContract.connect(signer).approve(marketplace.address, tokenId);
      },
      undefined,
      true
    );
    runAsyncAction(
      async () => {
        await marketplace
          .connect(signer)
          .addItemForSell(nftContract.address, tokenId, ethers.utils.parseEther("0.0001"));
      },
      undefined,
      true
    );
  };

  const getTokens = () => (
    <div>
      <>
        <h3 className="token-title">Owned sales</h3>
        {nftSales.length ? (
          <div className="sales">
            {nftSales.map((sale) => (
              <div key={sale.id} className="sale">
                <span>Id: {sale.id}</span>
                <span>Owner: {sale.token.ownerId}</span>
                <span>Price: {ethers.utils.formatEther(sale.price)}</span>
                <Button onClick={async () => handleItemRemoveFromSell(sale.id)}>
                  Remove sale
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty">No available sales.</div>
        )}
      </>
      <>
        <h3 className="token-title">Owned tokens</h3>
        {nfts.length ? (
          <div className="tokens">
            {nfts.map((nft) => (
              <div key={nft.id} className="token">
                <span>Id: {nft.id}</span>
                <Button onClick={async () => handleItemAddToSell(nft.id)}>Add for sell</Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty">No available tokens.</div>
        )}
      </>
    </div>
  );

  return (
    <div className="inventory">{isLoading || loading ? <div>Loading...</div> : getTokens()}</div>
  );
}
