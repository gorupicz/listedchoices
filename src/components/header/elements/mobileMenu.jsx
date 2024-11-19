import Link from "next/link";
import {
  FaRegUser,
  FaRegHeart,
  FaShoppingCart,
  FaFacebookF,
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
import MobileMenuIcon from './mobileMenuIcon';
import MobileMegaMenu from './mobileMegaMenu';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';

const MobileMenu = function ({ offCanVastoggleBtn, closeSideBar }) {
  const { cartItems } = useSelector((state) => state.cart);
  const { data: session, status } = useSession();
  const [isValidPhoto, setIsValidPhoto] = useState(false);
  const { t } = useTranslation('header');

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
              <input type="text" placeholder={t('searchPlaceholder')} />
              <button>
                <FaSearch />
              </button>
            </form>
          </div>
          <div className="ltn__utilize-menu">
            <ul>
              <MobileMenuIcon eventKey="1" onClickHandler={onClickHandler} />
              <MobileMegaMenu eventKey="1" onClickHandler={onClickHandler} />
              <MobileMenuIcon eventKey="2" onClickHandler={onClickHandler} />
              <MobileMenuIcon eventKey="3" onClickHandler={onClickHandler} />
            </ul>
          </div>
          <div className="ltn__utilize-buttons ltn__utilize-buttons-2">
            <ul>
              <li>
                <Link href={ session && status === "authenticated" ? "/my-account" : "/login" } title={t('myAccount')}>
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
                  {t('myAccount')}
                </Link>
              </li>
              <li>
                <Link href={ session && status === "authenticated" ? "/wishlist" : "/login" } title={t('wishlist')}>
                  <span className="utilize-btn-icon">
                    <FaRegHeart />
                    {cartItems.length > 0 ? (
                      <sup>{cartItems.length}</sup>
                    ) : (
                      <sup>0</sup>
                    )}
                  </span>
                  {t('wishlist')}
                </Link>
              </li>
              <li>
                <Link href={session && status === "authenticated" ? "/cart" : "/login"} title={t('shopingCart')}>
                  <span className="utilize-btn-icon">
                    <FaShoppingCart />
                    {cartItems.length > 0 ? (
                      <sup>{cartItems.length}</sup>
                    ) : (
                      <sup>0</sup>
                    )}
                  </span>
                  {t('shopingCart')}
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
