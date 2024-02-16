import Link from "next/link";
import { FaPlus, FaAngleDoubleRight } from "react-icons/fa";
const MenuList = ({ addListing }) => {
  return (
    <ul>
      <li className="menu-icon">
        <Link href="/">
          Home <FaPlus />
        </Link>
        <ul className="sub-menu menu-pages-img-show">
          <li>
            <Link href="/">Home Style 01</Link>
            <img src="/img/home-demos/home-1.jpg" alt="#" />
          </li>
          <li>
            <Link href="/home/page-two">Home Style 02</Link>
            <img src="/img/home-demos/home-2.jpg" alt="#" />
          </li>
          <li>
            <Link href="/home/page-three">Home Style 03</Link>
            <img src="/img/home-demos/home-3.jpg" alt="#" />
          </li>
          <li>
            <Link href="/home/page-four">Home Style 04</Link>
            <img src="/img/home-demos/home-4.jpg" alt="#" />
          </li>
          <li>
            <Link href="/home/page-five">Home Style 05</Link>
            <img src="/img/home-demos/home-5.jpg" alt="#" />
          </li>
          <li>
            <Link href="/home/page-six">Home Style 06</Link>
            <img src="/img/home-demos/home-6.jpg" alt="#" />
          </li>
          <li>
            <Link href="/home/page-seven">Home Style 07</Link>
            <img src="/img/home-demos/home-7.jpg" alt="#" />
          </li>
          <li>
            <Link href="/home/page-eight">Home Style 08</Link>
            <img src="/img/home-demos/home-8.jpg" alt="#" />
          </li>
          <li>
            <Link href="/home/page-nine">Home Style 09</Link>
            <img src="/img/home-demos/home-9.jpg" alt="#" />
          </li>
          <li>
            <Link href="/home/page-ten">Home Style 10</Link>
            <img src="/img/home-demos/home-10.jpg" alt="#" />
          </li>
          <li>
            <Link href="/home/page-eleven">Home Style 11</Link>
            <img src="/img/home-demos/home-11.jpg" alt="#" />
          </li>
        </ul>
      </li>
      <li className="menu-icon">
        <Link href="/about">
          About <FaPlus />
        </Link>
        <ul>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/service">Services</Link>
          </li>

          <li>
            <Link href="/portfolio">Portfolio</Link>
          </li>
          <li>
              <Link href="/portfolio/page-two">Portfolio - 02</Link>
            </li>

          <li>
            <Link href="/team">Team</Link>
          </li>

          <li>
            <Link href="/faq">FAQ</Link>
          </li>
          <li>
            <Link href="/locations">Google Map Locations</Link>
          </li>
        </ul>
      </li>
      <li className="menu-icon">
        <Link href="#">
          Property <FaPlus />
        </Link>
        <ul>
          <li>
            <Link href="/shop">Property</Link>
          </li>
          <li>
            <Link href="/shop/grid">Property Grid</Link>
          </li>
          <li>
            <Link href="/shop/list">Property List</Link>
          </li>
          <li>
            <Link href="/shop/left-sidebar">Property Left sidebar</Link>
          </li>
          <li>
            <Link href="/shop/right-sidebar">Property right sidebar</Link>
          </li>

          <li>
            <Link href="#">
              Other Pages
              <span className="float-end">
                <FaAngleDoubleRight />
              </span>
            </Link>
            <ul>
              <li>
                <Link href="/cart">Cart</Link>
              </li>
              <li>
                <Link href="/wishlist">Wishlist</Link>
              </li>
              <li>
                <Link href="/checkout">Checkout</Link>
              </li>
              <li>
                <Link href="/order-tracking">Order Tracking</Link>
              </li>
              <li>
                <Link href="/my-account">My Account</Link>
              </li>
              <li>
                <Link href="/login">Sign in</Link>
              </li>
              <li>
                <Link href="/register">Register</Link>
              </li>
            </ul>
          </li>
        </ul>
      </li>
      <li className="menu-icon">
        <Link href="#">
          News <FaPlus />
        </Link>
        <ul>
          <li>
            <Link href="/blog">News</Link>
          </li>
          <li>
            <Link href="/blog/grid">News Grid</Link>
          </li>
          <li>
            <Link href="/blog/left-sidebar">News Left sidebar</Link>
          </li>
          <li>
            <Link href="/blog/right-sidebar">News Right sidebar</Link>
          </li>
        </ul>
      </li>
      <li className="menu-icon mega-menu-parent">
        <Link href="#">
          Pages <FaPlus />
        </Link>
        <ul className="mega-menu mega-menu column-4">
          <li>
            <Link href="#">Inner Pages</Link>
            <ul>
              <li>
                <Link href="/portfolio">Portfolio</Link>
              </li>
              <li>
                <Link href="/portfolio/page-two">Portfolio - 02</Link>
              </li>

              <li>
                <Link href="/team">Team</Link>
              </li>

              <li>
                <Link href="/faq">FAQ</Link>
              </li>
            </ul>
          </li>
          <li>
            <Link href="#">Inner Pages</Link>
            <ul>
              <li>
                <Link href="/history">History</Link>
              </li>
              <li>
                <Link href="/add-listing">Add Listing</Link>
              </li>
              <li>
                <Link href="/locations">Google Map Locations</Link>
              </li>
              <li>
                <Link href="/404">404</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
              <li>
                <Link href="/coming-soon">Coming Soon</Link>
              </li>
            </ul>
          </li>
          <li>
            <Link href="#">Property Pages</Link>
            <ul>
              <li>
                <Link href="/shop">Property</Link>
              </li>
              <li>
                <Link href="/shop/left-sidebar">Property Left sidebar</Link>
              </li>
              <li>
                <Link href="/shop/right-sidebar">Property right sidebar</Link>
              </li>
              <li>
                <Link href="/shop/grid">Property Grid</Link>
              </li>
              <li>
                <Link href="/shop/list">Property List</Link>
              </li>

              <li>
                <Link href="/cart">Cart</Link>
              </li>
            </ul>
          </li>
          <li>
            <Link href="/shop">
              <img src="/img/banner/menu-banner-1.jpg" alt="#" />
            </Link>
          </li>
        </ul>
      </li>
      <li>
        <Link href="/contact">Contact</Link>
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
