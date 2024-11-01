import Link from "next/link";
import Image from "next/image";
import {
  FaRegUser,
  FaRegHeart,
  FaShoppingCart,
  FaFacebookF,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaSearch,
} from "react-icons/fa";

import {
  getSiblings,
  getClosest,
  slideUp,
  slideDown,
  slideToggle,
} from "@/lib/product";
import { useSelector } from "react-redux";
import menuListData from '@/data/header/elements/menuIcon/index.json';
import headerData from "@/data/header/index.json";
import { useSession } from 'next-auth/react';
import { useState, useEffect } from "react";

const MobileMenu = function ({ offCanVastoggleBtn, closeSideBar }) {
  const { cartItems } = useSelector((state) => state.cart);

  const { data: session, status } = useSession();

  const [isValidPhoto, setIsValidPhoto] = useState(false);

  useEffect(() => {
    if (session && session.user.photograph) {
      fetch(session.user.photograph)
        .then(response => {
          if (response.status === 200) {
            setIsValidPhoto(true);
          } else {
            setIsValidPhoto(false);
          }
        })
        .catch(() => setIsValidPhoto(false));
    }
  }, [session]);

  const onClickHandler = (e) => {
    const target = e.currentTarget;
    const parentEl = target.parentElement;
    parentEl.classList.toggle("active");
    if (
      parentEl?.classList.contains("menu-expand") ||
      target.classList.contains("menu-expand")
    ) {
      const element = target.classList.contains("icon") ? parentEl : target;
      const parent = getClosest(element, "li");
      const childNodes = parent.childNodes;
      const parentSiblings = getSiblings(parent);
      parentSiblings.forEach((sibling) => {
        sibling.classList.remove("active");
        const sibChildNodes = sibling.childNodes;
        sibChildNodes.forEach((child) => {
          if (child.nodeName === "UL") {
            slideUp(child, 1000);
          }
        });
      });
      childNodes.forEach((child) => {
        if (child.nodeName === "UL") {
          slideToggle(child, 1000);
        }
      });
    }
  };

  return (
    <>
      <div
        id="ltn__utilize-mobile-menu"
        className={`ltn__utilize ltn__utilize-mobile-menu   ${
          offCanVastoggleBtn ? "ltn__utilize-open" : ""
        }`}
      >
        <button onClick={closeSideBar} className="close close-button-mobile-menu" variant="secondary">
          <span aria-hidden="true">&times;</span>
        </button>
        <div className="ltn__utilize-menu-inner ltn__scrollbar">
          <div className="ltn__utilize-menu-head">
            <div className="site-logo">
              <Link href="/">
                <img src="/img/logo.png" alt="Logo" />
              </Link>
            </div>
          </div>
          <div className="ltn__utilize-menu-search-form">
            <form action="#">
              <input type="text" placeholder="Search..." />
              <button>
                <FaSearch />
              </button>
            </form>
          </div>
          <div className="ltn__utilize-menu">
            <ul>
              <li>
                <Link href={menuListData.tabs[0].link}>{menuListData.tabs[0].label}</Link>
                <span
                  className="menu-expand"
                  onClick={onClickHandler}
                  aria-hidden="true"
                ></span>
                <ul className="sub-menu">
                  <li>
                    <Link href={menuListData.tabs[0].subtabs[0].link}>{menuListData.tabs[0].subtabs[0].label}</Link>
                  </li>
                  <li>
                    <Link href={menuListData.tabs[0].subtabs[1].link}>{menuListData.tabs[0].subtabs[1].label}</Link>
                  </li>
                  <li>
                    <Link href={menuListData.tabs[0].subtabs[2].link}>{menuListData.tabs[0].subtabs[2].label}</Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link href={menuListData.tabs[1].link}>{menuListData.tabs[1].label}</Link>
                <span
                  className="menu-expand"
                  onClick={onClickHandler}
                  aria-hidden="true"
                ></span>
                <ul className="sub-menu">
                  <li>
                    <Link href={menuListData.tabs[1].subtabs[0].link}>{menuListData.tabs[1].subtabs[0].label}</Link>
                  </li>
                  <li>
                    <Link href={menuListData.tabs[1].subtabs[1].link}>{menuListData.tabs[1].subtabs[1].label}</Link>
                  </li>

                  <li>
                    <Link href={menuListData.tabs[1].subtabs[2].link}>{menuListData.tabs[1].subtabs[2].label}</Link>
                  </li>
                  <li>
                    <Link href={menuListData.tabs[1].subtabs[3].link}>{menuListData.tabs[1].subtabs[3].label}</Link>
                  </li>
                </ul>
              </li>
              <li>
              </li>
              <li>
                <Link href={menuListData.tabs[2].link}>{menuListData.tabs[2].label}</Link>
              </li>
            </ul>
          </div>
          <div className="ltn__utilize-buttons ltn__utilize-buttons-2">
            <ul>
              <li>
                <Link href={ session && status === "authenticated" ? "/my-account" : "/login" } title={headerData.myAccount}>
                  <span className="utilize-btn-icon">
                  {isValidPhoto ? (
                    <img
                      src={session.user.photograph}
                      alt="User Photograph"
                      className="user-photograph"
                    />
                  ) : (
                    <FaRegUser />
                  )}
                </span>
                  {headerData.myAccount}
                </Link>
              </li>
              <li>
                <Link href={ session && status === "authenticated" ? "/wishlist" : "/login" } title={headerData.wishlist}>
                  <span className="utilize-btn-icon">
                    <FaRegHeart />
                    {cartItems.length > 0 ? (
                      <sup>{cartItems.length}</sup>
                    ) : (
                      <sup>0</sup>
                    )}
                  </span>
                  {headerData.wishlist}
                </Link>
              </li>
              <li>
                <Link href={session && status === "authenticated" ? "/cart" : "/login"} title={headerData.shopingCart}>
                  <span className="utilize-btn-icon">
                    <FaShoppingCart />
                    {cartItems.length > 0 ? (
                      <sup>{cartItems.length}</sup>
                    ) : (
                      <sup>0</sup>
                    )}
                  </span>
                  {headerData.shopingCart}
                </Link>
              </li>
            </ul>
          </div>
          <div className="ltn__social-media-2">
            <ul>
              <li>
                <Link href="https://www.facebook.com/bolsadecasasmx" target="_blank">
                  <FaFacebookF />
                </Link>
              </li>
              <li>
                <Link href="https://www.linkedin.com/company/bolsadecasas/" target="_blank">
                  <FaLinkedin />
                </Link>
              </li>
              <li>
                <Link href="https://www.instagram.com/bolsadecasasmx/" target="_blank">
                  <FaInstagram />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
