import Link from "next/link";
import Image from "next/image";
import { FaPlus, FaAngleDoubleRight } from "react-icons/fa";

const MenuList = ({ addListing }) => {
  return (
    <ul>
      <li className="menu-icon">
        <Link href="/shop">
          Invierte
        </Link>
        
      </li>
      <li className="menu-icon">
        <Link href="#">
          Propietarios
        </Link>
      </li>
      <li className="menu-icon">
        <Link href="/about">
          Anfitriones
        </Link>
      </li>
      <li>
        <Link href="/contact">Nosotros</Link>
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
