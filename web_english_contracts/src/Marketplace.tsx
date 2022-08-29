import { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { BigNumber, ethers } from "ethers";
import { useQuery, gql } from "@apollo/client";

import { useMetamask } from "use-metamask";
import { useAsyncAction } from "./hooks/use-async-action";
import { ContractContext } from "./App";

import "./Marketplace.css";

type NftSale = {
  id: string;
  price: BigNumber;
  token: {
    ownerId: string;
  };
};

export default function Marketplace() {
  const [nftSales, setNftSales] = useState<NftSale[]>([]);
  const { nftContract, marketplace } = useContext(ContractContext);

  const { isLoading, runAsyncAction } = useAsyncAction();
  const { metaState } = useMetamask();

  const { loading, error, data } = useQuery(
    gql`
      query ($first: Int, $owner: String) {
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
      const { nftSales }: { nftSales: NftSale[] } = data;
      setNftSales(nftSales);
    }
  }, [data]);

  const handleItemBought = async (tokenId: string, price: BigNumber) => {
    if (metaState.account.length) {
      runAsyncAction(async () => {
        await marketplace
          .connect(metaState.account[0])
          .buyItem(nftContract.address, tokenId, { value: price });
      });
    }
  };

  const getSales = () => (
    <div>
      {!nftSales.length ? (
        <div className="empty">No available sales.</div>
      ) : (
        <div className="sales">
          {nftSales.map((sale) => (
            <div key={sale.id} className="sale">
              <span>Id: {sale.id}</span>
              <span>Owner: {sale.token.ownerId}</span>
              <span>Price: {ethers.utils.formatEther(sale.price)}</span>
              <Button onClick={async () => handleItemBought(sale.id, sale.price)}>
                Remove sale
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="marketplace">{isLoading || loading ? <div>Loading...</div> : getSales()}</div>
  );
}
