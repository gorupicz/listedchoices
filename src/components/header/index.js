import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { productSlug } from "@/lib/product";
import Link from "next/link";
import Image from "next/image";
import HeaderTopBarOne from "./headerTopBar/headerTopBarStyleOne";
import HeaderCartMenu from "./elements/headerCartMenu";
import MobileMenu from "./elements/mobileMennu";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import clsx from "clsx";
import { FaCartArrowDown, FaRegUser, FaSearch, FaTimes } from "react-icons/fa";
import MenuList from "@/components/header/elements/menuList";
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';  // Import the useSession hook
import headerData from "@/data/header/index.json";  // Importing the JSON data

const Header = function ({ SetToggleClassName, topbar }) {
  const { data: session, status } = useSession();  // Get the session and status
  const router = useRouter();
  const isHomePage = router.pathname === '/';

  // Add a condition to hide the user-menu on specific routes
  const hideUserMenuPages = ['/login', '/register'];
  const hideUserMenu = hideUserMenuPages.includes(router.pathname);

  const [searchFormOpener, searchFormOpenerSet] = useState(false);
  const [cartMenuOpener, cartMenuOpenerSet] = useState(false);
  const [overlayBtn, SetoverlayBtn] = useState(false);
  const [offCanVastoggleBtn, SetOffCanVastoggleBtn] = useState(false);

  function offcanVasToggler() {
    SetToggleClassName(true);
    SetoverlayBtn(true);
    SetOffCanVastoggleBtn((offCanVastoggleBtn) => !offCanVastoggleBtn);
  }

  function searchForm() {
    searchFormOpenerSet((searchFormOpener) => !searchFormOpener);
  }

  function cartMenu() {
    SetoverlayBtn(true);
    cartMenuOpenerSet((cartMenuOpener) => !cartMenuOpener);
    SetToggleClassName(false);
  }

  function closeSideBar() {
    SetoverlayBtn(false);
    cartMenuOpenerSet(false);
    SetOffCanVastoggleBtn(false);
  }

  function overlay() {
    SetoverlayBtn((overlayBtn) => !overlayBtn);
    cartMenuOpenerSet(false);
    SetOffCanVastoggleBtn(false);
    SetToggleClassName(false);
  }

  const { cartItems } = useSelector((state) => state.cart);

  const [scroll, setScroll] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  useEffect(() => {
    const header = document.querySelector(".ltn__header-sticky");
    setHeaderHeight(header.offsetHeight);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = () => {
    setScroll(window.scrollY);
  };

  const { products } = useSelector((state) => state.product);
  const [currentItems, setCurrentItems] = useState([]);

  const [query, setQuery] = useState("");
  const keys = ["title"];
  const SearchProduct = (data) => {
    return data.filter((item) =>
      keys.some((key) => item[key].toLowerCase().includes(query))
    );
  };

  const updatedProducts = query.length ? SearchProduct(products) : [];

  useEffect(() => {
    setCurrentItems(updatedProducts);
  }, [products, query]);

  return (
    <>
      <header className="ltn__header-area ltn__header-5">
        {topbar ? <HeaderTopBarOne /> : null}

        <div
          className={clsx(
            "ltn__header-middle-area ltn__header-sticky ltn__sticky-bg-white",
            scroll > headerHeight && "sticky-active"
          )}
        >
          <Container>
            <Row>
              <Col>
                <div className="site-logo-wrap">
                  <div className="site-logo">
                    <Link href="/">
                      <Image
                        src={headerData.logo}
                        alt={headerData.logoAltText}
                        width={185}
                        height={77}
                      />
                    </Link>
                  </div>
                </div>
              </Col>
              <Col className="header-menu-column">
                <div className="header-menu d-none d-xl-block">
                  <nav>
                    <div className="ltn__main-menu">
                      <MenuList addListing={false} />
                    </div>
                  </nav>
                </div>
              </Col>
              {!hideUserMenu && (
                <Col className={`ltn__header-options ltn__header-options-2 mb-sm-20 ${isHomePage && "hide"}`}>
                  <div className="header-search-wrap">
                    <div
                      className={`header-search-1 ${
                        searchFormOpener ? "search-open" : ""
                      }`}
                    >
                      <div className="search-icon">
                        <span onClick={searchForm}>
                          <FaSearch className="icon-search for-search-show" />
                        </span>
                        <span onClick={searchForm}>
                          <FaTimes className="icon-cancel for-search-close" />
                        </span>
                      </div>
                    </div>
                    <div
                      className={`header-search-1-form ${
                        searchFormOpener ? "search-open" : ""
                      }`}
                    >
                      <form id="#" method="get" action="#">
                        <input
                          onChange={(e) => setQuery(e.target.value.toLowerCase())}
                          type="text"
                          name="search"
                          placeholder={headerData.searchPlaceholder}
                        />
                        <button type="submit">
                          <span>
                            <FaSearch />
                          </span>
                        </button>
                      </form>

                      <ul className="searched-product-lists list-group">
                        {currentItems.length > 0 ? (
                          currentItems.map((product, key) => {
                            const slug = productSlug(product.title);
                            return (
                              <li key={key} className="list-group-item">
                                <Link href={`/shop/${slug}`}>
                                  {product.title}
                                </Link>
                              </li>
                            );
                          })
                        ) : (
                          <li>{headerData.noProducts}</li>
                        )}
                      </ul>
                    </div>
                  </div>
                  <div className="mini-cart-icon">
                    <button
                      onClick={cartMenu}
                      className={`ltn__utilize-toggle ${
                        cartMenuOpener ? "close" : ""
                      }`}
                    >
                      <FaCartArrowDown />
                      {cartItems.length > 0 ? (
                        <sup>{cartItems.length}</sup>
                      ) : (
                        <sup>{headerData.emptyCart}</sup>
                      )}
                    </button>
                  </div>
                                    <div className="ltn__drop-menu user-menu">
                    <ul>
                      <li>
                        <Link href="#">
                          {session && session.user.photograph ? (
                            <img
                              src={session.user.photograph}
                              alt="User Photograph"
                              className="user-photograph"
                              style={{ width: '30px', height: '30px', borderRadius: '50%' }}
                            />
                          ) : (
                            <FaRegUser />
                          )}
                        </Link>
                        <ul>
                          {(!session || status !== "authenticated") && (
                            <>
                              <li>
                                <Link href="/login">{headerData.signIn}</Link>
                              </li>
                              <li>
                                <Link href="/register">{headerData.register}</Link>
                              </li>
                            </>
                          )}
                          {session && status === "authenticated" && (
                            <li>
                              <Link href="/my-account">{headerData.myAccount}</Link>
                            </li>
                          )}
                          <li>
                            <Link
                              href={session && status === "authenticated" ? "/wishlist" : "/login"}
                            >
                              {headerData.wishlist}
                            </Link>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </div>

                  <div className="mobile-menu-toggle d-xl-none">
                    <button
                      onClick={offcanVasToggler}
                      className={`ltn__utilize-toggle ${
                        offCanVastoggleBtn ? "close" : ""
                      }`}
                    >
                      <svg viewBox="0 0 800 600">
                        <path
                          d="M300,220 C300,220 520,220 540,220 C740,220 640,540 520,420 C440,340 300,200 300,200"
                          id="top"
                        ></path>
                        <path d="M300,320 L540,320" id="middle"></path>
                        <path
                          d="M300,210 C300,210 520,210 540,210 C740,210 640,530 520,410 C440,330 300,190 300,190"
                          id="bottom"
                          transform="translate(480, 320) scale(1, -1) translate(-480, -318) "
                        ></path>
                      </svg>
                    </button>
                  </div>
                </Col>
              )}
            </Row>
          </Container>
        </div>
      </header>

      <MobileMenu
        offcanVasToggler={offcanVasToggler}
        closeSideBar={closeSideBar}
      />

      <div
        className="ltn__utilize-overlay"
        style={{
          display: overlayBtn ? "block" : "none",
          opacity: overlayBtn ? "1" : "0",
        }}
        onClick={overlay}
      ></div>
    </>
  );
};

export { Header };