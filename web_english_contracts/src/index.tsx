import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { MetamaskStateProvider } from "use-metamask";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";

const API_URL = "https://api.thegraph.com/subgraphs/name/goodoose/english_auction";

const getGraphClient = () =>
  new ApolloClient({
    uri: API_URL,
    cache: new InMemoryCache(),
  });

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ApolloProvider client={getGraphClient()}>
        <MetamaskStateProvider>
          <App />
        </MetamaskStateProvider>
      </ApolloProvider>
    </BrowserRouter>
  </React.StrictMode>
);
