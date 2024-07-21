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
        <Link href="https://chat.whatsapp.com/JWT0uzy8k5V4auRfWE40T1" target="_blank" title="Comunidad de WhatsApp de Anfitriones de Airbnb">
          Propietarios
        </Link>
      </li>
      <li className="menu-icon">
        <Link href="/about">
          Anfitriones
        </Link>
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
