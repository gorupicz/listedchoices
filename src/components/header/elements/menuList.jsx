import Link from "next/link";
import menuListData from "@/data/header/menuList/index.json"; // Import text content

const MenuList = ({ addListing }) => {
  return (
    <ul>
      <li className="menu-icon">
        <Link href="/shop">
          {menuListData.tabs[0].label}
        </Link>
        <ul>
          <li>
            <Link href="/cart">{menuListData.tabs[0].subtabs[0].label}</Link>
          </li>
          <li>
            <Link href="/wishlist">{menuListData.tabs[0].subtabs[1].label}</Link>
          </li>
          <li>
            <Link href="/checkout">{menuListData.tabs[0].subtabs[2].label}</Link>
          </li>
        </ul>
      </li>
      <li className="menu-icon mega-menu-parent">
        <Link href={`${menuListData.tabs[1].link}`} target={menuListData.tabs[1].target} title={menuListData.tabs[1].title}>
          {menuListData.tabs[1].label}
        </Link>
        <ul className="mega-menu column-2">
          <li>
            <Link href={`${menuListData.tabs[1].subtabs[0].link}`} target={menuListData.tabs[1].subtabs[0].target} title={menuListData.tabs[1].subtabs[0].title}>
              {menuListData.tabs[1].subtabs[0].label}
            </Link>
            <ul>
              <li>
                <Link href={`${menuListData.tabs[1].subtabs[1].link}`} target={menuListData.tabs[1].subtabs[1].target} title={menuListData.tabs[1].subtabs[1].title}>
                  {menuListData.tabs[1].subtabs[1].label}
                </Link>
              </li>
              <li>
                <Link href={`${menuListData.tabs[1].subtabs[2].link}`} target={menuListData.tabs[1].subtabs[2].target} title={menuListData.tabs[1].subtabs[2].title}>
                  {menuListData.tabs[1].subtabs[2].label}
                </Link>
              </li>
            </ul>
          </li>
          <li>
              <img 
                src={menuListData.tabs[1].imgSrc} 
                alt={menuListData.tabs[1].imgAlt} 
              />
          </li>
        </ul>
      </li>
      <li className="menu-icon">
        <Link href="/about">
          {menuListData.tabs[2].label}
        </Link>
      </li>

      {addListing ? (
        <li className="special-link">
          <Link href="/add-listing">{menuListData.tabs[3].label}</Link>
        </li>
      ) : null}
    </ul>
  );
};

export default MenuList;
