import Link from "next/link";
import menuListData from "@/data/header/menuList/index.json"; // Import text content

const MenuList = ({ addListing }) => {
  return (
    <ul>
      <li className="menu-icon">
        <Link href="/shop">
          {menuListData.loansLinkText}
        </Link>
      </li>
      <li className="menu-icon">
        <Link href="https://chat.whatsapp.com/JWT0uzy8k5V4auRfWE40T1" target="_blank" title={menuListData.whatsappCommunityLinkTitle}>
          {menuListData.communityLinkText}
        </Link>
      </li>
      <li className="menu-icon">
        <Link href="/about">
          {menuListData.investorsLinkText}
        </Link>
      </li>

      {addListing ? (
        <li className="special-link">
          <Link href="/add-listing">{menuListData.addListingText}</Link>
        </li>
      ) : null}
    </ul>
  );
};

export default MenuList;
