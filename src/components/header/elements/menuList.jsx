import Link from "next/link";
import menuListData from "@/data/header/elements/menuList/index.json"; // Import text content
import { FaHome, FaUserAlt, FaMapMarkerAlt, FaList, FaHeart, FaMapMarked, FaDollarSign, FaSignOutAlt, FaLock, FaFacebookF, FaWhatsapp, FaYoutube, FaInstagram, FaLinkedin } from "react-icons/fa";
import React, { useState } from "react";
import Image from 'next/image';
import MenuIcon from '@/components/header/elements/menuIcon';
import MegaMenu from '@/components/header/elements/megaMenu';



// Map icon names to React components
const iconMap = {
  FaHome: FaHome,
  FaUserAlt: FaUserAlt,
  FaMapMarkerAlt: FaMapMarkerAlt,
  FaList: FaList,
  FaHeart: FaHeart,
  FaMapMarked: FaMapMarked,
  FaDollarSign: FaDollarSign,
  FaLock: FaLock,
  FaFacebookF: FaFacebookF,
  FaWhatsapp: FaWhatsapp,
  FaYoutube: FaYoutube,
  FaInstagram: FaInstagram,
  FaLinkedin: FaLinkedin,
};

const MenuList = ({ addListing }) => {
  
  return (
    <ul>
      <MenuIcon value="1" />
      <MegaMenu value="1" />
      <MenuIcon value="2" />
      <MenuIcon value="3" />

      {addListing ? (
        <li className="special-link">
          <Link href={`${menuListData.tabs[4].link}`} target={menuListData.tabs[4].target} title={menuListData.tabs[4].title}>
            <span className="icon-text">
              {menuListData.tabs[4].icon ? React.createElement(iconMap[menuListData.tabs[4].icon]) : null}
            </span>
            {menuListData.tabs[4].label}
          </Link>
        </li>
      ) : null}
    </ul>
  );
};

export default MenuList;
