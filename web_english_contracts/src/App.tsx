import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useMetamask } from "use-metamask";
import { Web3Provider } from "@ethersproject/providers";
import { nftContractAbi, marketplaceAbi } from "./abi";
import Header from "./Header";
import Router from "./Router";

import "./App.css";

export type ContractsState = {
  nftContract: ethers.Contract;
  marketplace: ethers.Contract;
};

const contractsStateDefault = {
  nftContract: {} as ethers.Contract,
  marketplace: {} as ethers.Contract,
};

export const ContractContext = React.createContext<ContractsState>(contractsStateDefault);

function App() {
  const { connect, metaState } = useMetamask();
  const [stateContracts, setStateContracts] = useState<ContractsState>(contractsStateDefault);

  useEffect(() => {
    if (!metaState.isConnected) {
      const initContract = async () => {
        try {
          await connect(Web3Provider);

          const nftContract = new ethers.Contract(
            process.env.NFT_ADDRESS ?? "",
            nftContractAbi,
            metaState.web3
          ).connect(metaState.account[0]);
          const marketplace = new ethers.Contract(
            process.env.MARKETPLACE_ADDRESS ?? "",
            marketplaceAbi,
            metaState.web3
          ).connect(metaState.account[0]);
          setStateContracts({ nftContract, marketplace });
        } catch (error) {
          console.log(error);
        }
      };
      initContract();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metaState.isConnected]);

  return (
    <ContractContext.Provider value={stateContracts}>
      <Header />
      <Router />
    </ContractContext.Provider>
  );
}

export default App;
