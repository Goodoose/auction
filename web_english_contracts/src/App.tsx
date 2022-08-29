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
  signer: ethers.providers.JsonRpcSigner;
};

const contractsStateDefault = {
  nftContract: {} as ethers.Contract,
  marketplace: {} as ethers.Contract,
  signer: {} as ethers.providers.JsonRpcSigner,
};

export const ContractContext = React.createContext<ContractsState>(contractsStateDefault);

function App() {
  const { connect, metaState } = useMetamask();
  const [stateContracts, setStateContracts] = useState<ContractsState>(contractsStateDefault);
  useEffect(() => {
    if (!metaState.isConnected) {
      (async () => {
        try {
          await connect(Web3Provider);
          if (!window.ethereum) return;
          const { ethereum } = window;

          const provider = new ethers.providers.Web3Provider(ethereum, "any");
          await provider.send("eth_requestAccounts", []);

          const signer = provider.getSigner();

          const nftContract = new ethers.Contract(
            "0x83A7e66c40eB768B7873d2b7f33e3C71Af5217B4",
            nftContractAbi,
            metaState.web3
          );
          const marketplace = new ethers.Contract(
            "0x0cBD6f6661569B25723c53029e28cA3D2732f143",
            marketplaceAbi,
            metaState.web3
          );
          setStateContracts({ nftContract, marketplace, signer });
        } catch (error) {
          console.log(error);
        }
      })();
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
