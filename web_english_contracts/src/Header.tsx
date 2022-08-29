import { Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

import "./Header.css";

export default function Header() {
  return (
    <div className="header">
      <Navbar bg="dark" variant="dark">
        <Link className="link" to="marketplace">
          Marketplace
        </Link>
        <Link className="link" to="items">
          Items
        </Link>
      </Navbar>
    </div>
  );
}
