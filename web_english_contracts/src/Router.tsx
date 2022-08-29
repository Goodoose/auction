import { Route, Routes } from "react-router-dom";

import Marketplace from "./Marketplace";
import Items from "./Items";

export default function Router() {
  return (
    <Routes>
      <Route path="marketplace" element={<Marketplace />} />
      <Route path="items" element={<Items />} />
      <Route path="*" element={<Marketplace />} />
    </Routes>
  );
}
