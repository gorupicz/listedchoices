import Link from "next/link";
import { FaPlus, FaAngleDoubleRight } from "react-icons/fa";
const MenuList = ({ addListing }) => {
  return (
    <ul>
      <li className="menu-icon">
        <Link href="/shop">
          Invest
        </Link>
        
      </li>
      <li className="menu-icon">
        <Link href="/about">
          Sell
        </Link>
      </li>
      <li className="menu-icon">
        <Link href="/about">
          Host
        </Link>
      </li>
      <li>
        <Link href="/contact">About</Link>
      </li>

      {addListing ? (
        <li className="special-link">
          <Link href="/add-listing">Add Listing</Link>
        </li>
      ) : null}
    </ul>
  );
};

export default MenuList;
