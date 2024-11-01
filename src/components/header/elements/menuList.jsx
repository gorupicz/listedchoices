import Link from "next/link";
import menuListData from "@/data/header/menuList/index.json"; // Import text content
import { FaHome, FaUserAlt, FaMapMarkerAlt, FaList, FaHeart, FaMapMarked, FaDollarSign, FaSignOutAlt, FaLock, FaFacebookF, FaWhatsapp, FaYoutube, FaInstagram, FaLinkedin } from "react-icons/fa";
import React, { useState } from "react";
import Image from 'next/image';

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
  const [hoveredImgSrc, setHoveredImgSrc] = useState(menuListData.tabs[1].imgSrc);

  const handleMouseEnter = (imgSrc) => {
    if (imgSrc) {
      setHoveredImgSrc(imgSrc);
    }
  };

  const handleMouseLeave = () => {
    setHoveredImgSrc(menuListData.tabs[1].imgSrc);
  };

  return (
    <ul>
      <li className="menu-icon">
        <Link href={`${menuListData.tabs[0].link}`} target={menuListData.tabs[0].target} title={menuListData.tabs[0].title}>
          <span className="icon-text">
            {menuListData.tabs[0].subtabs[0].icon ? React.createElement(iconMap[menuListData.tabs[0].subtabs[0].icon]) : null}
          </span>
          {menuListData.tabs[0].label}
        </Link>
        <ul>
          <li>
            <Link href={`${menuListData.tabs[0].subtabs[0].link}`} target={menuListData.tabs[0].subtabs[0].target} title={menuListData.tabs[0].subtabs[0].title}>
              <span className="icon-text">
                {menuListData.tabs[0].subtabs[0].icon ? React.createElement(iconMap[menuListData.tabs[0].subtabs[0].icon]) : null}
              </span>
              {menuListData.tabs[0].subtabs[0].label}
            </Link>
          </li>
          <li>
            <Link href={`${menuListData.tabs[0].subtabs[1].link}`} target={menuListData.tabs[0].subtabs[1].target} title={menuListData.tabs[0].subtabs[1].title}>
              <span className="icon-text">
                {menuListData.tabs[0].subtabs[1].icon ? React.createElement(iconMap[menuListData.tabs[0].subtabs[1].icon]) : null}
              </span>
              {menuListData.tabs[0].subtabs[1].label}
            </Link>
          </li>
          <li>
            <Link href={`${menuListData.tabs[0].subtabs[2].link}`} target={menuListData.tabs[0].subtabs[2].target} title={menuListData.tabs[0].subtabs[2].title}>
              <span className="icon-text">
                {menuListData.tabs[0].subtabs[2].icon ? React.createElement(iconMap[menuListData.tabs[0].subtabs[2].icon]) : null}
              </span>
              {menuListData.tabs[0].subtabs[2].label}
            </Link>
          </li>
        </ul>
      </li>
      <li className="menu-icon mega-menu-parent">
        <Link href={`${menuListData.tabs[1].link}`} target={menuListData.tabs[1].target} title={menuListData.tabs[1].title}>
          <span className="icon-text">
            {menuListData.tabs[1].subtabs[0].icon ? React.createElement(iconMap[menuListData.tabs[1].subtabs[0].icon]) : null}
          </span>
          {menuListData.tabs[1].label}
        </Link>
        <ul className="mega-menu column-4">
          <li>
            <Link href={`${menuListData.tabs[1].subtabs[0].link}`} target={menuListData.tabs[1].subtabs[0].target} title={menuListData.tabs[1].subtabs[0].title}
              onMouseEnter={() => handleMouseEnter(menuListData.tabs[1].subtabs[0].imgSrc)}
              onMouseLeave={handleMouseLeave}>
              <span className="icon-text">
                {menuListData.tabs[1].subtabs[0].icon ? React.createElement(iconMap[menuListData.tabs[1].subtabs[0].icon]) : null}
              </span>
              {menuListData.tabs[1].subtabs[0].label}
            </Link>
            <ul>
              <li>
                <Link href={`${menuListData.tabs[1].subtabs[0].sub_subtabs[0] .link}`} target={menuListData.tabs[1].subtabs[0].sub_subtabs[0].target} title={menuListData.tabs[1].subtabs[0].sub_subtabs[0].title}
                  onMouseEnter={() => handleMouseEnter(menuListData.tabs[1].subtabs[0].sub_subtabs[0].imgSrc)}
                  onMouseLeave={handleMouseLeave}>
                  <span className="icon-text">
                    {menuListData.tabs[1].subtabs[0].sub_subtabs[0].icon ? React.createElement(iconMap[menuListData.tabs[1].subtabs[0].sub_subtabs[0].icon]) : null}
                  </span>
                  {menuListData.tabs[1].subtabs[0].sub_subtabs[0].label}
                </Link>
              </li>
              <li>
                <Link href={`${menuListData.tabs[1].subtabs[0].sub_subtabs[1].link}`} target={menuListData.tabs[1].subtabs[0].sub_subtabs[1].target} title={menuListData.tabs[1].subtabs[0].sub_subtabs[1].title}
                  onMouseEnter={() => handleMouseEnter(menuListData.tabs[1].subtabs[0].sub_subtabs[1].imgSrc)}
                  onMouseLeave={handleMouseLeave}>
                  <span className="icon-text">
                    {menuListData.tabs[1].subtabs[0].sub_subtabs[1].icon ? React.createElement(iconMap[menuListData.tabs[1].subtabs[0].sub_subtabs[1].icon]) : null}
                  </span>
                  {menuListData.tabs[1].subtabs[0].sub_subtabs[1].label}
                </Link>
              </li>
              <li>
                <Link href={`${menuListData.tabs[1].subtabs[0].sub_subtabs[2].link}`} target={menuListData.tabs[1].subtabs[0].sub_subtabs[2].target} title={menuListData.tabs[1].subtabs[0].sub_subtabs[2].title}
                  onMouseEnter={() => handleMouseEnter(menuListData.tabs[1].subtabs[0].sub_subtabs[2].imgSrc)}
                  onMouseLeave={handleMouseLeave}>
                  <span className="icon-text">
                    {menuListData.tabs[1].subtabs[0].sub_subtabs[2].icon ? React.createElement(iconMap[menuListData.tabs[1].subtabs[0].sub_subtabs[2].icon]) : null}
                  </span>
                  {menuListData.tabs[1].subtabs[0].sub_subtabs[2].label}
                </Link>
              </li>
            </ul>
          </li>
          <li>
            <Link href={`${menuListData.tabs[1].subtabs[1].link}`} target={menuListData.tabs[1].subtabs[1].target} title={menuListData.tabs[1].subtabs[1].title}
              onMouseEnter={() => handleMouseEnter(menuListData.tabs[1].subtabs[1].imgSrc)}
              onMouseLeave={handleMouseLeave}>
              <span className="icon-text">
                {menuListData.tabs[1].subtabs[1].icon ? React.createElement(iconMap[menuListData.tabs[1].subtabs[1].icon]) : null}
              </span>
              {menuListData.tabs[1].subtabs[1].label}
            </Link>
            <ul>
              <li>
                <Link href={`${menuListData.tabs[1].subtabs[1].sub_subtabs[0].link}`} target={menuListData.tabs[1].subtabs[1].sub_subtabs[0].target} title={menuListData.tabs[1].subtabs[1].sub_subtabs[0].title}
                  onMouseEnter={() => handleMouseEnter(menuListData.tabs[1].subtabs[1].sub_subtabs[0].imgSrc)}
                  onMouseLeave={handleMouseLeave}>
                  <span className="icon-text">
                    {menuListData.tabs[1].subtabs[1].sub_subtabs[0].icon ? React.createElement(iconMap[menuListData.tabs[1].subtabs[1].sub_subtabs[0].icon]) : null}
                  </span>
                  {menuListData.tabs[1].subtabs[1].sub_subtabs[0].label}
                </Link>
              </li>
              <li>
                <Link href={`${menuListData.tabs[1].subtabs[1].sub_subtabs[1].link}`} target={menuListData.tabs[1].subtabs[1].sub_subtabs[1].target} title={menuListData.tabs[1].subtabs[1].sub_subtabs[1].title}
                  onMouseEnter={() => handleMouseEnter(menuListData.tabs[1].subtabs[1].sub_subtabs[1].imgSrc)}
                  onMouseLeave={handleMouseLeave}>
                  <span className="icon-text">
                    {menuListData.tabs[1].subtabs[1].sub_subtabs[1].icon ? React.createElement(iconMap[menuListData.tabs[1].subtabs[1].sub_subtabs[1].icon]) : null}
                  </span>
                  {menuListData.tabs[1].subtabs[1].sub_subtabs[1].label}
                </Link>
              </li>
            </ul>
          </li>
          <li>
            <Link href={`${menuListData.tabs[1].subtabs[2].link}`} target={menuListData.tabs[1].subtabs[2].target} title={menuListData.tabs[1].subtabs[2].title}
              onMouseEnter={() => handleMouseEnter(menuListData.tabs[1].subtabs[2].imgSrc)}
              onMouseLeave={handleMouseLeave}>
              <span className="icon-text">
                {menuListData.tabs[1].subtabs[2].icon ? React.createElement(iconMap[menuListData.tabs[1].subtabs[2].icon]) : null}
              </span>
              {menuListData.tabs[1].subtabs[2].label}
            </Link>
            <ul>
              <li>
                <Link href={`${menuListData.tabs[1].subtabs[2].sub_subtabs[0].link}`} target={menuListData.tabs[1].subtabs[2].sub_subtabs[0].target} title={menuListData.tabs[1].subtabs[2].sub_subtabs[0].title}
                  onMouseEnter={() => handleMouseEnter(menuListData.tabs[1].subtabs[2].sub_subtabs[0].imgSrc)}
                  onMouseLeave={handleMouseLeave}>
                  <span className="icon-text">
                    {menuListData.tabs[1].subtabs[2].sub_subtabs[0].icon ? React.createElement(iconMap[menuListData.tabs[1].subtabs[2].sub_subtabs[0].icon]) : null}
                  </span>
                  {menuListData.tabs[1].subtabs[2].sub_subtabs[0].label}
                </Link>
              </li>
            </ul>
          </li>
          <li>
            {hoveredImgSrc && (
              <Image
                src={hoveredImgSrc.startsWith('http') ? hoveredImgSrc : `${process.env.NEXT_PUBLIC_BASE_URL}${hoveredImgSrc}`}
                alt={menuListData.tabs[1].imgAlt}
                layout="responsive"
                width={500}
                height={300}
              />
            )}
          </li>
        </ul>
      </li>
      <li className="menu-icon">
        <Link href={`${menuListData.tabs[2].link}`} target={menuListData.tabs[2].target} title={menuListData.tabs[2].title}>
          <span className="icon-text">
            {menuListData.tabs[2].subtabs[0].icon ? React.createElement(iconMap[menuListData.tabs[2].subtabs[0].icon]) : null}
          </span>
          {menuListData.tabs[2].label}
        </Link>
        <ul>
          <li>
            <Link href={`${menuListData.tabs[2].subtabs[0].link}`} target={menuListData.tabs[2].subtabs[0].target} title={menuListData.tabs[2].subtabs[0].title}>
              <span className="icon-text">
                {menuListData.tabs[2].subtabs[0].icon ? React.createElement(iconMap[menuListData.tabs[2].subtabs[0].icon]) : null}
              </span>
              {menuListData.tabs[2].subtabs[0].label}
            </Link>
          </li>
          <li>
            <Link href={`${menuListData.tabs[2].subtabs[1].link}`} target={menuListData.tabs[2].subtabs[1].target} title={menuListData.tabs[2].subtabs[1].title}>
              <span className="icon-text">
                {menuListData.tabs[2].subtabs[1].icon ? React.createElement(iconMap[menuListData.tabs[2].subtabs[1].icon]) : null}
              </span>
              {menuListData.tabs[2].subtabs[1].label}
            </Link>
          </li>
          <li>
            <Link href={`${menuListData.tabs[2].subtabs[2].link}`} target={menuListData.tabs[2].subtabs[2].target} title={menuListData.tabs[2].subtabs[2].title}>
              <span className="icon-text">
                {menuListData.tabs[2].subtabs[2].icon ? React.createElement(iconMap[menuListData.tabs[2].subtabs[2].icon]) : null}
              </span>
              {menuListData.tabs[2].subtabs[2].label}
            </Link>
          </li>
          <li>
            <Link href={`${menuListData.tabs[2].subtabs[3].link}`} target={menuListData.tabs[2].subtabs[3].target} title={menuListData.tabs[2].subtabs[3].title}>
              <span className="icon-text">
                {menuListData.tabs[2].subtabs[3].icon ? React.createElement(iconMap[menuListData.tabs[2].subtabs[3].icon]) : null}
              </span>
              {menuListData.tabs[2].subtabs[3].label}
            </Link>
          </li>
        </ul>
      </li>
      <li className="menu-icon">
        <Link href={`${menuListData.tabs[3].link}`} target={menuListData.tabs[3].target} title={menuListData.tabs[3].title}>
          <span className="icon-text">
            {menuListData.tabs[3].icon ? React.createElement(iconMap[menuListData.tabs[3].icon]) : null}
          </span>
          {menuListData.tabs[3].label}
        </Link>
      </li>

      {addListing ? (
        <li className="special-link">
          <Link href={`${menuListData.tabs[4].link}`} target={menuListData.tabs[4].target} title={menuListData.tabs[4].title}>
            <span className="icon-text">
              {menuListData.tabs[4].subtabs[0].icon ? React.createElement(iconMap[menuListData.tabs[4].subtabs[0].icon]) : null}
            </span>
            {menuListData.tabs[4].label}
          </Link>
        </li>
      ) : null}
    </ul>
  );
};

export default MenuList;
