import Link from "next/link";
import Image from "next/image";
import Slider from "react-slick";
import clsx from "clsx";
import { Fragment, useState, useEffect } from "react";
import Head from "next/head";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import {
  FaArrowRight,
  FaArrowLeft,
  FaPlay,
  FaStar,
  FaStarHalfAlt,
  FaSearch,
  FaRegStar,
  FaDribbble,
  FaInstagram,
  FaTwitter,
  FaFacebookF,
  FaUserAlt,
  FaEnvelope,
  FaGlobe,
  FaPencilAlt,
  FaCalendarAlt,
  FaAirbnb,
  FaYoutube,
  FaExclamationCircle,
  FaCircle
} from "react-icons/fa";
import BreadCrumb from "@/components/breadCrumbs";

import { Layout } from "@/layouts";
import { useSelector } from "react-redux";
import { getProducts, productSlug, getDiscountPrice } from "@/lib/product";
import products from "@/data/products.json";
import { Container, Row, Col, Nav, Tab } from "react-bootstrap";
import RelatedProduct from "@/components/product/related-product";
import FollowUs from "@/components/followUs";
import Tags from "@/components/tags";
import blogData from "@/data/blog";
import CallToAction from "@/components/callToAction";
import ModalVideo from "react-modal-video";
import { useRouter } from "next/router";

function ProductDetails({ product }) {
  const { products } = useSelector((state) => state.product);
  const { cartItems } = useSelector((state) => state.cart);
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { compareItems } = useSelector((state) => state.compare);
  const latestdBlogs = getProducts(blogData, "buying", "featured", 4);

  const TooltipSpan = ({ id, title, children }) => (
    <OverlayTrigger
      placement="bottom"
      delay={{ show: 250, hide: 400 }}
      overlay={<Tooltip id={id}>{title}</Tooltip>}>
        {children}
    </OverlayTrigger>
  );

  const relatedProducts = getProducts(
    products,
    product.category[0],
    "popular",
    2
  );

  const topRatedProducts = getProducts(
    products,
    product.category[0],
    "topRated",
    2
  );
  const popularProducts = getProducts(
    products,
    product.category[0],
    "popular",
    4
  );

  const discountedPrice = getDiscountPrice(
    product.price,
    product.discount
  ).toFixed(2);

  const productPrice = product.price.toFixed(2);
  const cartItem = cartItems.find((cartItem) => cartItem.id === product.id);
  const wishlistItem = wishlistItems.find(
    (wishlistItem) => wishlistItem.id === product.id
  );
  const compareItem = compareItems.find(
    (compareItem) => compareItem.id === product.id
  );

  const SlickArrowLeft = ({ currentSlide, slideCount, ...props }) => (
    <button
      {...props}
      className={
        "slick-prev slick-arrow" + (currentSlide === 0 ? " slick-disabled" : "")
      }
      aria-hidden="true"
      aria-disabled={currentSlide === 0 ? true : false}
      type="button"
    >
      <FaArrowLeft />
    </button>
  );
  const SlickArrowRight = ({ currentSlide, slideCount, ...props }) => (
    <button
      {...props}
      className={
        "slick-next slick-arrow" +
        (currentSlide === slideCount - 1 ? " slick-disabled" : "")
      }
      aria-hidden="true"
      aria-disabled={currentSlide === slideCount - 1 ? true : false}
      type="button"
    >
      <FaArrowRight />
    </button>
  );
  const productDetailsCarouselSettings = {
    autoplay: true,
    autoplaySpeed: 2000,
    centerMode: true,
    infinite: true,
    centerPadding: "450px",
    slidesToShow: 1,
    dots: false,
    speed: 500,
    prevArrow: <SlickArrowLeft />,
    nextArrow: <SlickArrowRight />,
    responsive: [
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerPadding: "250px",
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerPadding: "250px",
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerPadding: "200px",
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerPadding: "150px",
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerPadding: "0px",
          dots: true,
        },
      },
    ],
  };

  const popular_product = {
    infinite: true,
    slidesToShow: 1,
    dots: true,
    speed: 500,
    arrows: false,
  };

  const [isOpen, setOpen] = useState(false);

  const router = useRouter();
  const pageTitle = product.title + " - " + product.locantion;
  const pageDescription = product.description.shortDescription;
  const ogImage = product.carousel[0].img;
  const [scroll, setScroll] = useState(0);
  const [sliderHeight, setSliderHeight] = useState(0);
    
  useEffect(() => {
    const slider = document.querySelector(".ltn__CaC-widget");
    setSliderHeight(slider.offsetHeight);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = () => {
    setScroll(window.scrollY);
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && router.isReady) {
      document.title = pageTitle;
      document.querySelector('meta[property="og:title"]').setAttribute("content", pageTitle);
      document.querySelector('meta[property="og:description"]').setAttribute("content", pageDescription);
      document.querySelector('meta[property="og:image"]').setAttribute("content", `/img/img-slide/${ogImage}`);
    }
  }, [router.isReady, product]);

  return (
    <>
      <Layout topbar={false}>
        <Head>
          <title>{pageTitle}</title>
          <meta property="og:title" content={pageTitle} />
          <meta property="og:description" content={pageDescription} />
          <meta property="og:image" content={`/img/img-slide/${ogImage}`} />
        </Head>
        
        <ModalVideo
          channel="youtube"
          youtube={{
              autoplay: 1,
              mute: 1
            }}
          isOpen={isOpen}
          videoId="j3d3_dIkeXU"
          onClose={() => setOpen(false)}
        />
        {/* <!-- BREADCRUMB AREA START --> */}
{/*
        <BreadCrumb
          title="Product Details"
          sectionPace="mb-0"
          currentSlug={product.title}
        />

        {/* <!-- BREADCRUMB AREA END --> */}

        {/* <!-- IMAGE SLIDER AREA START (img-slider-3) --> */}
        <div className="ltn__img-slider-area mb-90">
          <Container fluid className="px-0">
            <Slider
              {...productDetailsCarouselSettings}
              className="ltn__image-slider-5-active slick-arrow-1 slick-arrow-1-inner"
            >
              {product.carousel.map((single, key) => {
                return (
                  <div className="ltn__img-slide-item-4" key={key}>
                    <Link href="#">
                      <Image
                        src={`/img/img-slide/${single.img}`}
                        alt={`${single.title}`}
                        width={1904}
                        height={1006}
                        layout="responsive"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                      />
                    </Link>
                  </div>
                );
              })}
            </Slider>
          </Container>
        </div>
        {/* <!-- IMAGE SLIDER AREA END -->

    <!-- SHOP DETAILS AREA START --> */}
        <div className="ltn__shop-details-area pb-10">
          <Container>
            <Row>
              <Col xs={12} lg={8}>
                <div className="ltn__shop-details-inner ltn__page-details-inner mb-60">
                  <div className="ltn__blog-meta">
                    <ul>
                      {
                        (product.featured ? (
                          <li className="ltn__blog-category">
                            <Link href="#">Featured</Link>
                          </li>
                        ) : (
                          ""
                        ),
                          product.rent ? (
                            <li className="ltn__blog-category">
                              <Link className="bg-orange" href="#">
                                For Rent
                              </Link>
                            </li>
                          ) : (
                            ""
                          ))
                      }
                    </ul>
                  </div>
                  <h1 className="ltn__primary-color"> {product.title}</h1>
                  <label>
                    <span className="ltn__secondary-color">
                      <i className="flaticon-pin"></i>
                    </span>{" "}
                    {product.locantion}
                  </label>
                  <h4 className="title-2"> {product.description.title}</h4>
                  <p>{product.description.shortDescription}</p>

                  <h4 className="title-2">Financials (Past 12 months)</h4>
                  <div className="property-detail-info-list section-bg-1 clearfix mb-60">
                    <ul>
                      <li>
                        <label>Rent:</label>
                        <span>${new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(product.income)}</span>
                      </li>
                      <li>
                        <TooltipSpan title="Estimated expenses include property taxes, property insurance, management services, tax/audit expenses, LLC registration expenses, and interest if leveraged. Additionally, our model accounts for estimated repairs and maintenance costs equal to 6% of rent collected, and a vacancy expense allocation that assumes 15 days per year, whether incurred or not." id="expenses">
                          <label> 
                            Operating, Financing, Legal & Mgmt Expenses{' '}
                            <FaExclamationCircle />
                          </label>
                        </TooltipSpan> 
                        <span>${new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(product.expenses)}</span>
                      </li>
                    </ul>
                    <ul>
                      <li>
                        <label>Free Cash Flow / Dividend:</label>
                        <span>${new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(product.income - product.expenses)}</span>
                      </li>
                      <li>
                        <label>Asset Valuation:</label>
                        <span>${new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(product.price)}</span>
                      </li>
                      <li>
                        <label>Return %:</label> <span>{new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format((product.income - product.expenses)/product.price*100)}%</span>
                      </li>
                    </ul>
                  </div>

                  <h4 className="title-2">Vacation Rental Performance</h4>
                  <div className="property-detail-info-list section-bg-1 clearfix mb-60">
                    <ul>
                      <li>
                        <label>Occupancy (Last month):</label>
                        <span>{new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(product.vacationRentalDetails.lastMonthOccupancyRate)}%</span>
                      </li>
                      <li>
                        <TooltipSpan title="The average daily rate (ADR) measures the average rental revenue earned for an occupied room per day. Multiplying the ADR by the occupancy rate equals the revenue per available room (RevPAR)" id="adr">
                        <label>ADR (Last month){' '}
                            <FaExclamationCircle />
                          </label>
                        </TooltipSpan>
                        <span>${new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(product.vacationRentalDetails.lastMonthAdr)}</span>
                      </li>
                      <li>
                        <TooltipSpan title="RevPAN stands for Revenue per Available Night. Available nights are defined as nights that can be sold for a property compared to unavailable nights. Unavailable nights are when maintenance, cleaning, or renovation is taking place at the property." id="revpan">
                          <label> 
                            RevPAR (Year to date){' '}
                            <FaExclamationCircle />
                          </label>
                        </TooltipSpan> 
                        <span>${new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(product.vacationRentalDetails.YearToDateRevPAR)}</span>
                      </li>
                      <li>
                        <label style={{maxWidth: `100%`}}>
                          <Link
                            href="https://forms.gle/27foVLZWB7nhufNC9"
                            target="_blank"
                          >
                            What other metrics would you like to see here?
                          </Link>
                        </label>
                      </li>
                    </ul>
                    <ul>
                      <li>
                        <label style={{maxWidth: `100%`}}>
                          <Link
                            href={product.vacationRentalDetails.listings.airbnb}
                            target="_blank"
                          >
                            <FaAirbnb /> Listing on Airbnb
                          </Link>
                        </label>
                      </li>
                      <li>
                        <label style={{maxWidth: `100%`}}>
                          <Link
                            href={product.vacationRentalDetails.listings.booking}
                            target="_blank"
                          >
                            <FaCircle /> Listing on Booking.com
                          </Link>
                        </label>
                      </li>
                    </ul>
                  </div>

                  <h4 className="title-2">Location</h4>
                  <div className="property-details-google-map mb-60">
                    <iframe
                      src={`${product.googleMaps}`}
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      allowFullScreen=""
                    ></iframe>
                  </div>
                  {/* <!--  
                  <h4 className="title-2">Facts and Features</h4>
                  <div className="property-detail-feature-list clearfix mb-45">
                    <ul>
                      <li>
                        <div className="property-detail-feature-list-item">
                          <i className="flaticon-double-bed"></i>
                          <div>
                            <h6>Living Room</h6>
                            <small>{product.factsAndFeatures.livingRoom}</small>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="property-detail-feature-list-item">
                          <i className="flaticon-double-bed"></i>
                          <div>
                            <h6>Garage</h6>
                            <small>{product.factsAndFeatures.garage}</small>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="property-detail-feature-list-item">
                          <i className="flaticon-double-bed"></i>
                          <div>
                            <h6>Dining Area</h6>
                            <small>{product.factsAndFeatures.diningArea}</small>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="property-detail-feature-list-item">
                          <i className="flaticon-double-bed"></i>
                          <div>
                            <h6>Bedroom</h6>
                            <small>{product.factsAndFeatures.bedroom}</small>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="property-detail-feature-list-item">
                          <i className="flaticon-double-bed"></i>
                          <div>
                            <h6>Bathroom</h6>
                            <small>{product.factsAndFeatures.bathroom}</small>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="property-detail-feature-list-item">
                          <i className="flaticon-double-bed"></i>
                          <div>
                            <h6>Gym Area</h6>
                            <small>{product.factsAndFeatures.gymArea}</small>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="property-detail-feature-list-item">
                          <i className="flaticon-double-bed"></i>
                          <div>
                            <h6>Garden</h6>
                            <small>{product.factsAndFeatures.garden}</small>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="property-detail-feature-list-item">
                          <i className="flaticon-double-bed"></i>
                          <div>
                            <h6>Parking</h6>
                            <small>{product.factsAndFeatures.parking}</small>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                   --> */}
                   {/* <!--
                  <h4 className="title-2">From Our Gallery</h4>
                  <div className="ltn__property-details-gallery mb-30">
                    <div className="row">
                      <div className="col-md-6">
                        <Link
                          href={`/img/others/${product.gallery.img1}`}
                          data-rel="lightcase:myCollection"
                        >
                          <img
                            className="mb-30"
                            src={`/img/others/${product.gallery.img1}`}
                            alt={`${product.title}`}
                          />
                        </Link>
                        <Link
                          href={`/img/others/${product.gallery.img2}`}
                          data-rel="lightcase:myCollection"
                        >
                          <img
                            className="mb-30"
                            src={`/img/others/${product.gallery.img2}`}
                            alt={`${product.title}`}
                          />
                        </Link>
                      </div>
                      <div className="col-md-6">
                        <Link
                          href={`/img/others/${product.gallery.img3}`}
                          data-rel="lightcase:myCollection"
                        >
                          <img
                            className="mb-30"
                            src={`/img/others/${product.gallery.img3}`}
                            alt={`${product.title}`}
                          />
                        </Link>
                      </div>
                    </div>
                  </div>
                  --> */}
                  {/* <!-- APARTMENTS PLAN AREA END --> */}
                  
                  <h4 className="title-2">Property Video</h4>
                  <div
                    className="ltn__video-bg-img ltn__video-popup-height-500 bg-overlay-black-50 bg-image mb-60"
                    style={{ backgroundImage: `url("../../img/img-slide/Elegance/01.jpg")` }}
                  >
                    <button
                      className="ltn__video-icon-2 ltn__video-icon-2-border---"
                      onClick={() => setOpen(true)}
                    >
                      <FaPlay />
                    </button>
                  </div>
                  
                  <h4 className="title-2 mb-10">Amenities</h4>

                  <div className="property-details-amenities mb-60">
                    <div className="row">
                      <div className="col-lg-4 col-md-6">
                        <div className="ltn__menu-widget">
                          <ul>
                            {product.amenities1.map((single, key) => {
                              return (
                                <li key={key}>
                                  <label className="checkbox-item">
                                    {single}
                                    <input
                                      type="checkbox"
                                      defaultChecked="checked"
                                    />
                                    <span className="checkmark"></span>
                                  </label>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="ltn__menu-widget">
                          <ul>
                            {product.amenities2.map((single, key) => {
                              return (
                                <li key={key}>
                                  <label className="checkbox-item">
                                    {single}
                                    <input
                                      type="checkbox"
                                      defaultChecked="checked"
                                    />
                                    <span className="checkmark"></span>
                                  </label>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="ltn__menu-widget">
                          <ul>
                            {product.amenities3.map((single, key) => {
                              return (
                                <li key={key}>
                                  <label className="checkbox-item">
                                    {single}
                                    <input
                                      type="checkbox"
                                      defaultChecked="checked"
                                    />
                                    <span className="checkmark"></span>
                                  </label>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>


                  <h4 className="title-2">Blueprint</h4>
                  {/* <!-- APARTMENTS PLAN AREA START --> */}

                  <div className="ltn__apartments-plan-area product-details-apartments-plan mb-60">
                    <Tab.Container defaultActiveKey="first">
                      {/* <!--
                      <div className="ltn__tab-menu ltn__tab-menu-3">
                        <Nav className="nav">
                          <Nav.Link eventKey="first">First Floor</Nav.Link>
                          <Nav.Link eventKey="second">Second Floor</Nav.Link>
                          <Nav.Link eventKey="third">Third Floor</Nav.Link>
                          <Nav.Link eventKey="fourth">Top Garden</Nav.Link>
                        </Nav>
                      </div>
                      --> */}
                      <Tab.Content>
                        <Tab.Pane eventKey="first">
                          <div className="ltn__apartments-tab-content-inner">
                            <div className="row">
                              <div className="col-lg-7" style={{ width: `100%`, height: `312px` }}>
                                <div className="apartments-plan-img">
                                  <Image 
                                    src="/img/others/hunter.webp" 
                                    alt="#" 
                                    fill={true}
                                    style={{objectFit: 'cover'}}

                                    />
                                </div>
                              </div>
                              {/* <!--
                              <div className="col-lg-5">
                                <div className="apartments-plan-info">
                                  <h2>First Floor</h2>
                                  <p>
                                    Enimad minim veniam quis nostrud
                                    exercitation ullamco laboris. Lorem ipsum
                                    dolor sit amet cons aetetur adipisicing elit
                                    sedo eiusmod tempor.Incididunt labore et
                                    dolore magna aliqua. sed ayd minim veniam.
                                  </p>
                                </div>
                              </div>
                          --> */}
                              {/* <!--
                              <div className="col-lg-12">
                                <div className="product-details-apartments-info-list  section-bg-1">
                                  <div className="row">
                                    <div className="col-lg-6">
                                      <div className="apartments-info-list apartments-info-list-color">
                                        <ul>
                                          <li>
                                            <label>Total Area</label>{" "}
                                            <span>2800 Sq. Ft</span>
                                          </li>
                                          <li>
                                            <label>Bedroom</label>{" "}
                                            <span>150 Sq. Ft</span>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                    <div className="col-lg-6">
                                      <div className="apartments-info-list apartments-info-list-color">
                                        <ul>
                                          <li>
                                            <label>Belcony/Pets</label>
                                            <span>Allowed</span>
                                          </li>
                                          <li>
                                            <label>Lounge</label>
                                            <span>650 Sq. Ft</span>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              --> */}
                            </div>
                          </div>
                        </Tab.Pane>
                        <Tab.Pane eventKey="second">
                          <div className="ltn__product-tab-content-inner">
                            <div className="row">
                              <div className="col-lg-7">
                                <div className="apartments-plan-img">
                                  <img src="/img/others/10.png" alt="#" />
                                </div>
                              </div>
                              <div className="col-lg-5">
                                <div className="apartments-plan-info">
                                  <h2>Second Floor</h2>
                                  <p>
                                    Enimad minim veniam quis nostrud
                                    exercitation ullamco laboris. Lorem ipsum
                                    dolor sit amet cons aetetur adipisicing elit
                                    sedo eiusmod tempor.Incididunt labore et
                                    dolore magna aliqua. sed ayd minim veniam.
                                  </p>
                                </div>
                              </div>
                              <div className="col-lg-12">
                                <div className="product-details-apartments-info-list  section-bg-1">
                                  <div className="row">
                                    <div className="col-lg-6">
                                      <div className="apartments-info-list apartments-info-list-color">
                                        <ul>
                                          <li>
                                            <label>Total Area</label>{" "}
                                            <span>2800 Sq. Ft</span>
                                          </li>
                                          <li>
                                            <label>Bedroom</label>{" "}
                                            <span>150 Sq. Ft</span>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                    <div className="col-lg-6">
                                      <div className="apartments-info-list apartments-info-list-color">
                                        <ul>
                                          <li>
                                            <label>Belcony/Pets</label>{" "}
                                            <span>Allowed</span>
                                          </li>
                                          <li>
                                            <label>Lounge</label>{" "}
                                            <span>650 Sq. Ft</span>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Tab.Pane>
                        <Tab.Pane eventKey="third">
                          <div className="ltn__product-tab-content-inner">
                            <div className="row">
                              <div className="col-lg-7">
                                <div className="apartments-plan-img">
                                  <img src="/img/others/10.png" alt="#" />
                                </div>
                              </div>
                              <div className="col-lg-5">
                                <div className="apartments-plan-info">
                                  <h2>Third Floor</h2>
                                  <p>
                                    Enimad minim veniam quis nostrud
                                    exercitation ullamco laboris. Lorem ipsum
                                    dolor sit amet cons aetetur adipisicing elit
                                    sedo eiusmod tempor.Incididunt labore et
                                    dolore magna aliqua. sed ayd minim veniam.
                                  </p>
                                </div>
                              </div>
                              <div className="col-lg-12">
                                <div className="product-details-apartments-info-list  section-bg-1">
                                  <div className="row">
                                    <div className="col-lg-6">
                                      <div className="apartments-info-list apartments-info-list-color">
                                        <ul>
                                          <li>
                                            <label>Total Area</label>{" "}
                                            <span>2800 Sq. Ft</span>
                                          </li>
                                          <li>
                                            <label>Bedroom</label>{" "}
                                            <span>150 Sq. Ft</span>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                    <div className="col-lg-6">
                                      <div className="apartments-info-list apartments-info-list-color">
                                        <ul>
                                          <li>
                                            <label>Belcony/Pets</label>{" "}
                                            <span>Allowed</span>
                                          </li>
                                          <li>
                                            <label>Lounge</label>{" "}
                                            <span>650 Sq. Ft</span>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Tab.Pane>
                        <Tab.Pane eventKey="fourth">
                          <div className="ltn__product-tab-content-inner">
                            <div className="row">
                              <div className="col-lg-7">
                                <div className="apartments-plan-img">
                                  <img src="/img/others/10.png" alt="#" />
                                </div>
                              </div>
                              <div className="col-lg-5">
                                <div className="apartments-plan-info">
                                  <h2>Top Garden</h2>
                                  <p>
                                    Enimad minim veniam quis nostrud
                                    exercitation ullamco laboris. Lorem ipsum
                                    dolor sit amet cons aetetur adipisicing elit
                                    sedo eiusmod tempor.Incididunt labore et
                                    dolore magna aliqua. sed ayd minim veniam.
                                  </p>
                                </div>
                              </div>
                              <div className="col-lg-12">
                                <div className="product-details-apartments-info-list  section-bg-1">
                                  <div className="row">
                                    <div className="col-lg-6">
                                      <div className="apartments-info-list apartments-info-list-color">
                                        <ul>
                                          <li>
                                            <label>Total Area</label>{" "}
                                            <span>2800 Sq. Ft</span>
                                          </li>
                                          <li>
                                            <label>Bedroom</label>{" "}
                                            <span>150 Sq. Ft</span>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                    <div className="col-lg-6">
                                      <div className="apartments-info-list apartments-info-list-color">
                                        <ul>
                                          <li>
                                            <label>Belcony/Pets</label>{" "}
                                            <span>Allowed</span>
                                          </li>
                                          <li>
                                            <label>Lounge</label>{" "}
                                            <span>650 Sq. Ft</span>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Tab.Pane>
                      </Tab.Content>
                    </Tab.Container>
                  </div>

                  {/* <!--
                  <div className="ltn__shop-details-tab-content-inner--- ltn__shop-details-tab-inner-2 ltn__product-details-review-inner mb-60">
                    
                  
                    <h4 className="title-2">Guests Reviews</h4>
                    <div className="product-ratting">
                      <ul>
                        <li>
                          <a href="#">
                            <FaStar />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <FaStar />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <FaStar />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <FaStar />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <FaRegStar />
                          </a>
                        </li>
                        <li className="review-total">
                          <a href="#"> ( ${product.vacationRentalDetails.reviews} Reviews )</a>
                        </li>
                      </ul>
                    </div>
                    <hr />
                    {/* <!-- comment-area --> */}
                    {/* <!--
                    <div className="ltn__comment-area mb-30">
                      <div className="ltn__comment-inner">
                        <ul>
                          <li>
                            <div className="ltn__comment-item clearfix">
                              <div className="ltn__commenter-img">
                                <img src="/img/testimonial/1.jpg" alt="Image" />
                              </div>
                              <div className="ltn__commenter-comment">
                                <h6>
                                  <a href="#">Adam Smit</a>
                                </h6>
                                <div className="product-ratting">
                                  <ul>
                                    <li>
                                      <a href="#">
                                        <FaStar />
                                      </a>
                                    </li>
                                    <li>
                                      <a href="#">
                                        <FaStar />
                                      </a>
                                    </li>
                                    <li>
                                      <a href="#">
                                        <FaStar />
                                      </a>
                                    </li>
                                    <li>
                                      <a href="#">
                                        <FaStar />
                                      </a>
                                    </li>
                                    <li>
                                      <a href="#">
                                        <FaRegStar />
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                                <p>
                                  Lorem ipsum dolor sit amet, consectetur
                                  adipisicing elit. Doloribus, omnis fugit
                                  corporis iste magnam ratione.
                                </p>
                                <span className="ltn__comment-reply-btn">
                                  September 3, 2020
                                </span>
                              </div>
                            </div>
                          </li>
                          <li>
                            <div className="ltn__comment-item clearfix">
                              <div className="ltn__commenter-img">
                                <img src="/img/testimonial/3.jpg" alt="Image" />
                              </div>
                              <div className="ltn__commenter-comment">
                                <h6>
                                  <a href="#">Adam Smit</a>
                                </h6>
                                <div className="product-ratting">
                                  <ul>
                                    <li>
                                      <a href="#">
                                        <FaStar />
                                      </a>
                                    </li>
                                    <li>
                                      <a href="#">
                                        <FaStar />
                                      </a>
                                    </li>
                                    <li>
                                      <a href="#">
                                        <FaStar />
                                      </a>
                                    </li>
                                    <li>
                                      <a href="#">
                                        <FaStar />
                                      </a>
                                    </li>
                                    <li>
                                      <a href="#">
                                        <FaRegStar />
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                                <p>
                                  Lorem ipsum dolor sit amet, consectetur
                                  adipisicing elit. Doloribus, omnis fugit
                                  corporis iste magnam ratione.
                                </p>
                                <span className="ltn__comment-reply-btn">
                                  September 2, 2020
                                </span>
                              </div>
                            </div>
                          </li>
                          <li>
                            <div className="ltn__comment-item clearfix">
                              <div className="ltn__commenter-img">
                                <img src="/img/testimonial/2.jpg" alt="Image" />
                              </div>
                              <div className="ltn__commenter-comment">
                                <h6>
                                  <a href="#">Adam Smit</a>
                                </h6>
                                <div className="product-ratting">
                                  <ul>
                                    <li>
                                      <a href="#">
                                        <FaStar />
                                      </a>
                                    </li>
                                    <li>
                                      <a href="#">
                                        <FaStar />
                                      </a>
                                    </li>
                                    <li>
                                      <a href="#">
                                        <FaStar />
                                      </a>
                                    </li>
                                    <li>
                                      <a href="#">
                                        <FaStar />
                                      </a>
                                    </li>
                                    <li>
                                      <a href="#">
                                        <FaRegStar />
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                                <p>
                                  Lorem ipsum dolor sit amet, consectetur
                                  adipisicing elit. Doloribus, omnis fugit
                                  corporis iste magnam ratione.
                                </p>
                                <span className="ltn__comment-reply-btn">
                                  September 2, 2020
                                </span>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                    {/* <!-- comment-reply --> */}
                    {/* <!--
                    <div className="ltn__comment-reply-area ltn__form-box mb-30">
                      <form action="#">
                        <h4>Add a Review</h4>
                        <div className="mb-30">
                          <div className="add-a-review">
                            <h6>Your Ratings:</h6>
                            <div className="product-ratting">
                              <ul>
                                <li>
                                  <a href="#">
                                    <FaStar />
                                  </a>
                                </li>
                                <li>
                                  <a href="#">
                                    <FaStar />
                                  </a>
                                </li>
                                <li>
                                  <a href="#">
                                    <FaStar />
                                  </a>
                                </li>
                                <li>
                                  <a href="#">
                                    <FaStar />
                                  </a>
                                </li>
                                <li>
                                  <a href="#">
                                    <FaStar />
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="input-item input-item-textarea ltn__custom-icon">
                          <textarea placeholder="Type your comments...."></textarea>
                          <span className="inline-icon">
                            <FaPencilAlt />
                          </span>
                        </div>
                        <div className="input-item input-item-name ltn__custom-icon">
                          <input type="text" placeholder="Type your name...." />
                          <span className="inline-icon">
                            <FaUserAlt />
                          </span>
                        </div>
                        <div className="input-item input-item-email ltn__custom-icon">
                          <input
                            type="email"
                            placeholder="Type your email...."
                          />
                          <span className="inline-icon">
                            <FaEnvelope />
                          </span>
                        </div>
                        <div className="input-item input-item-website ltn__custom-icon">
                          <input
                            type="text"
                            name="website"
                            placeholder="Type your website...."
                          />
                          <span className="inline-icon">
                            <FaGlobe />
                          </span>
                        </div>
                        <label className="mb-0">
                          <input type="checkbox" name="agree" /> Save my name,
                          email, and website in this browser for the next time I
                          comment.
                        </label>
                        <div className="btn-wrapper">
                          <button
                            className="btn theme-btn-1 btn-effect-1 text-uppercase"
                            type="submit"
                          >
                            Submit
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                  --> */}

                  <h4 className="title-2">Related Properties</h4>
                  <Row>
                    {relatedProducts.map((data, key) => {
                      const slug = productSlug(data.title);
                      const discountedPrice = getDiscountPrice(
                        product.price,
                        product.discount
                      ).toFixed(2);
                      const productPrice = product.price.toFixed(2);
                      const cartItem = cartItems.find(
                        (cartItem) => cartItem.id === product.id
                      );
                      const wishlistItem = wishlistItems.find(
                        (wishlistItem) => wishlistItem.id === product.id
                      );
                      const compareItem = compareItems.find(
                        (compareItem) => compareItem.id === product.id
                      );
                      return (
                        <Col xs={12} sm={6} key={key}>
                          <RelatedProduct
                            productData={data}
                            slug={slug}
                            baseUrl="shop"
                            discountedPrice={discountedPrice}
                            productPrice={productPrice}
                            cartItem={cartItem}
                            wishlistItem={wishlistItem}
                            compareItem={compareItem}
                          />
                        </Col>
                      );
                    })}
                  </Row>
                </div>
              </Col>

              <Col xs={12} lg={4}>
                <aside className="sidebar ltn__shop-sidebar ltn__right-sidebar---">
                  {/* <!-- Call to Action Widget --> */}
                  <div className={clsx(
                    "widget ltn__CaC-widget",
                    scroll > sliderHeight && "CaC-widget__sticky-active"
                  )}>
                    
                    <h4 className="ltn__widget-title ltn__widget-title-border-2">
                      <span>${new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(product.amountAvailable)}</span> Available
                    </h4>
                    <Link
                      href="/shop"
                      className="theme-btn-1 btn btn-effect-1"
                      id="main-call-to-action-at-product-page-for-gtm"
                    >
                      Sign up to invest
                    </Link>
                  </div>

                  {/* <!-- Guests Reviews Widget --> */}
                  {/* <!-- 
                  <div className="widget ltn__author-widget">
                    <div className="ltn__shop-details-tab-content-inner--- ltn__shop-details-tab-inner-2 ltn__product-details-review-inner mb-60">
                      <h4 className="title-2">Guests Reviews</h4>
                      <div className="product-ratting">
                        <ul>
                          <li>
                            <a href="#">
                              <FaStar />
                            </a>
                          </li>
                          <li>
                            <a href="#">
                              <FaStar />
                            </a>
                          </li>
                          <li>
                            <a href="#">
                              <FaStar />
                            </a>
                          </li>
                          <li>
                            <a href="#">
                              <FaStar />
                            </a>
                          </li>
                          <li>
                            <a href="#">
                              <FaRegStar />
                            </a>
                          </li>
                          <li className="review-total">
                            <a href="#"> ( {product.vacationRentalDetails.reviews} Reviews )</a>
                          </li>
                        </ul>
                      </div>
                      <hr />
                      {/* <!-- comment-area --> */}
                      {/* <!-- 
                      <div className="ltn__comment-area mb-30">
                        <div className="ltn__comment-inner">
                          <ul>
                            <li>
                              <div className="ltn__comment-item clearfix">
                                <div className="ltn__commenter-img">
                                  <img src="/img/testimonial/1.jpg" alt="Image" />
                                </div>
                                <div className="ltn__commenter-comment">
                                  <h6>
                                    <a href="#">Adam Smit</a>
                                  </h6>
                                  <div className="product-ratting">
                                    <ul>
                                      <li>
                                        <a href="#">
                                          <FaStar />
                                        </a>
                                      </li>
                                      <li>
                                        <a href="#">
                                          <FaStar />
                                        </a>
                                      </li>
                                      <li>
                                        <a href="#">
                                          <FaStar />
                                        </a>
                                      </li>
                                      <li>
                                        <a href="#">
                                          <FaStar />
                                        </a>
                                      </li>
                                      <li>
                                        <a href="#">
                                          <FaRegStar />
                                        </a>
                                      </li>
                                    </ul>
                                  </div>
                                  <p>
                                    Lorem ipsum dolor sit amet, consectetur
                                    adipisicing elit. Doloribus, omnis fugit
                                    corporis iste magnam ratione.
                                  </p>
                                  <span className="ltn__comment-reply-btn">
                                    September 3, 2020
                                  </span>
                                </div>
                              </div>
                            </li>
                            <li>
                              <div className="ltn__comment-item clearfix">
                                <div className="ltn__commenter-img">
                                  <img src="/img/testimonial/3.jpg" alt="Image" />
                                </div>
                                <div className="ltn__commenter-comment">
                                  <h6>
                                    <a href="#">Adam Smit</a>
                                  </h6>
                                  <div className="product-ratting">
                                    <ul>
                                      <li>
                                        <a href="#">
                                          <FaStar />
                                        </a>
                                      </li>
                                      <li>
                                        <a href="#">
                                          <FaStar />
                                        </a>
                                      </li>
                                      <li>
                                        <a href="#">
                                          <FaStar />
                                        </a>
                                      </li>
                                      <li>
                                        <a href="#">
                                          <FaStar />
                                        </a>
                                      </li>
                                      <li>
                                        <a href="#">
                                          <FaRegStar />
                                        </a>
                                      </li>
                                    </ul>
                                  </div>
                                  <p>
                                    Lorem ipsum dolor sit amet, consectetur
                                    adipisicing elit. Doloribus, omnis fugit
                                    corporis iste magnam ratione.
                                  </p>
                                  <span className="ltn__comment-reply-btn">
                                    September 2, 2020
                                  </span>
                                </div>
                              </div>
                            </li>
                            <li>
                              <div className="ltn__comment-item clearfix">
                                <div className="ltn__commenter-img">
                                  <img src="/img/testimonial/2.jpg" alt="Image" />
                                </div>
                                <div className="ltn__commenter-comment">
                                  <h6>
                                    <a href="#">Adam Smit</a>
                                  </h6>
                                  <div className="product-ratting">
                                    <ul>
                                      <li>
                                        <a href="#">
                                          <FaStar />
                                        </a>
                                      </li>
                                      <li>
                                        <a href="#">
                                          <FaStar />
                                        </a>
                                      </li>
                                      <li>
                                        <a href="#">
                                          <FaStar />
                                        </a>
                                      </li>
                                      <li>
                                        <a href="#">
                                          <FaStar />
                                        </a>
                                      </li>
                                      <li>
                                        <a href="#">
                                          <FaRegStar />
                                        </a>
                                      </li>
                                    </ul>
                                  </div>
                                  <p>
                                    Lorem ipsum dolor sit amet, consectetur
                                    adipisicing elit. Doloribus, omnis fugit
                                    corporis iste magnam ratione.
                                  </p>
                                  <span className="ltn__comment-reply-btn">
                                    September 2, 2020
                                  </span>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                      {/* <!-- comment-reply --> */}
                      {/* <!-- 
                      <div className="ltn__comment-reply-area ltn__form-box mb-30">
                        <form action="#">
                          <h4>Add a Review</h4>
                          <div className="mb-30">
                            <div className="add-a-review">
                              <h6>Your Ratings:</h6>
                              <div className="product-ratting">
                                <ul>
                                  <li>
                                    <a href="#">
                                      <FaStar />
                                    </a>
                                  </li>
                                  <li>
                                    <a href="#">
                                      <FaStar />
                                    </a>
                                  </li>
                                  <li>
                                    <a href="#">
                                      <FaStar />
                                    </a>
                                  </li>
                                  <li>
                                    <a href="#">
                                      <FaStar />
                                    </a>
                                  </li>
                                  <li>
                                    <a href="#">
                                      <FaStar />
                                    </a>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          <div className="input-item input-item-textarea ltn__custom-icon">
                            <textarea placeholder="Type your comments...."></textarea>
                            <span className="inline-icon">
                              <FaPencilAlt />
                            </span>
                          </div>
                          <div className="input-item input-item-name ltn__custom-icon">
                            <input type="text" placeholder="Type your name...." />
                            <span className="inline-icon">
                              <FaUserAlt />
                            </span>
                          </div>
                          <div className="input-item input-item-email ltn__custom-icon">
                            <input
                              type="email"
                              placeholder="Type your email...."
                            />
                            <span className="inline-icon">
                              <FaEnvelope />
                            </span>
                          </div>
                          <div className="input-item input-item-website ltn__custom-icon">
                            <input
                              type="text"
                              name="website"
                              placeholder="Type your website...."
                            />
                            <span className="inline-icon">
                              <FaGlobe />
                            </span>
                          </div>
                          <label className="mb-0">
                            <input type="checkbox" name="agree" /> Save my name,
                            email, and website in this browser for the next time I
                            comment.
                          </label>
                          <div className="btn-wrapper">
                            <button
                              className="btn theme-btn-1 btn-effect-1 text-uppercase"
                              type="submit"
                            >
                              Submit
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                  --> */}

                  {/* <!-- Author Widget --> */}
                  <div className="widget ltn__author-widget">
                    <div className="ltn__author-widget-inner text-center">
                      <img
                        src={`/img/team/${product.agent.img}`}
                        alt={`${product.agent.fullName}`}
                      />
                      <h5>{product.agent.fullName}</h5>
                      <small>{product.agent.designation}</small>
                      <div className="product-ratting">
                        <ul>
                          <li>
                            <a href="#">
                              <FaStar />
                            </a>
                          </li>
                          <li>
                            <a href="#">
                              <FaStar />
                            </a>
                          </li>
                          <li>
                            <a href="#">
                              <FaStar />
                            </a>
                          </li>
                          <li>
                            <a href="#">
                              <FaStar />
                            </a>
                          </li>
                          <li>
                            <a href="#">
                              <FaStar />
                            </a>
                          </li>
                          <li className="review-total">
                            {" "}
                            <Link href="#">
                              {" "}
                              ( {product.agent.raiting} Reviews )
                            </Link>
                          </li>
                        </ul>
                      </div>
                      <p>{product.agent.description}</p>

                      <div className="ltn__social-media">
                        <ul>
                          <li>
                            <a href="https://www.facebook.com/boatairbnb" title="Facebook">
                              <FaFacebookF />
                            </a>
                          </li>
                          <li>
                            <a href="https://www.instagram.com/boatschoice/" title="Instagram">
                              <FaInstagram />
                            </a>
                          </li>

                          <li>
                            <a href="https://www.youtube.com/channel/UCJau0nP2Ug5p-sXp7jcehKw/" title="Youtube">
                              <FaYoutube />
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  {/* <!-- Search Widget --> */}
                  {/* <!--
                  <div className="widget ltn__search-widget">
                    <h4 className="ltn__widget-title ltn__widget-title-border-2">
                      Search Objects
                    </h4>
                    <form action="#">
                      <input
                        type="text"
                        name="search"
                        placeholder="Search your keyword..."
                      />
                      <button type="submit">
                        <FaSearch />
                      </button>
                    </form>
                  </div>
                  --> */}
                  {/* <!-- Form Widget --> */}
                  <div className="widget ltn__form-widget">
                    <h4 className="ltn__widget-title ltn__widget-title-border-2">
                      Send us a message
                    </h4>
                    <form action="#">
                      <input
                        type="text"
                        name="yourname"
                        placeholder="Your Name*"
                      />
                      <input
                        type="text"
                        name="youremail"
                        placeholder="Your e-Mail*"
                      />
                      <textarea
                        name="yourmessage"
                        placeholder="Write Message..."
                      ></textarea>
                      <button type="submit" className="btn theme-btn-1">
                        Send Message
                      </button>
                    </form>
                  </div>
                  {/* <!-- Top Rated Product Widget --> */}
                  {/* <!-- 
                  <div className="widget ltn__top-rated-product-widget">
                    <h4 className="ltn__widget-title ltn__widget-title-border-2">
                      Top Rated Product
                    </h4>
                    <ul>
                      {topRatedProducts.map((product, keys) => {
                        const slug = productSlug(product.title);
                        let key = keys + 1;
                        return (
                          <li key={product.id}>
                            <div className="top-rated-product-item clearfix">
                              <div className="top-rated-product-img">
                                <a href={`/shop/${slug}`}>
                                  <img
                                    src={`/img/product/${key}.png`}
                                    alt={product.title}
                                  />
                                </a>
                              </div>
                              <div className="top-rated-product-info">
                                <div className="product-ratting">
                                  <ul>
                                    <li>
                                      <a href="#">
                                        <FaStar />
                                      </a>
                                    </li>
                                    <li>
                                      <a href="#">
                                        <FaStar />
                                      </a>
                                    </li>
                                    <li>
                                      <a href="#">
                                        <FaStar />
                                      </a>
                                    </li>
                                    <li>
                                      <a href="#">
                                        <FaStar />
                                      </a>
                                    </li>
                                    <li>
                                      <a href="#">
                                        <FaStar />
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                                <h6>
                                  <a href={`/shop/${slug}`}>{product.title}</a>
                                </h6>
                                <div className="product-price">
                                  <span>${product.price}</span>
                                  <del>${discountedPrice}</del>
                                </div>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                   --> */}
                  {/* <!-- Menu Widget (Category) --> */}
                  <div className="widget ltn__menu-widget ltn__menu-widget-2--- ltn__menu-widget-2-color-2---">
                    <h4 className="ltn__widget-title ltn__widget-title-border-2">
                      Top Categories
                    </h4>
                    <ul>
                      <li>
                        <Link href="#">
                          Apartments <span>(26)</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          Picture Stodio <span>(30)</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          Office <span>(71)</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          Luxary Vilas <span>(56)</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          Duplex House <span>(60)</span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                  {/* <!-- Popular Product Widget --> */}
                  <div className="widget ltn__popular-product-widget">
                    <h4 className="ltn__widget-title ltn__widget-title-border-2">
                      Popular Properties
                    </h4>

                    <Slider
                      {...popular_product}
                      className="row ltn__popular-product-widget-active slick-arrow-1"
                    >
                      {/* <!-- ltn__product-item --> */}

                      {popularProducts.map((product, key) => {
                        const slug = productSlug(product.title);
                        return (
                          <div
                            key={key}
                            className="ltn__product-item ltn__product-item-4 ltn__product-item-5 text-center---"
                          >
                            <div className="product-img">
                              <Link href={`/shop/${slug}`}>
                                <img
                                  src={`/img/product-3/${product.productImg}`}
                                  alt={slug}
                                />
                              </Link>
                              <div className="real-estate-agent">
                                <div className="agent-img">
                                  <Link href="#">
                                    <img src={`/img/blog/author.jpg`} alt="#" />
                                  </Link>
                                </div>
                              </div>
                            </div>
                            <div className="product-info">
                              <div className="product-price">
                                <span>
                                  ${product.price}
                                  <label>/Month</label>
                                </span>
                              </div>
                              <h2 className="product-title">
                                <Link href={`/shop/${slug}`}>
                                  {product.title}
                                </Link>
                              </h2>
                              <div className="product-img-location">
                                <ul>
                                  <li>
                                    <Link href="product-details">
                                      <i className="flaticon-pin"></i>
                                      {product.locantion}
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                              <ul className="ltn__list-item-2--- ltn__list-item-2-before--- ltn__plot-brief">
                                <li>
                                  <span>
                                    {product.propertyDetails.bedrooms}
                                  </span>
                                  <span className="ms-1">Bedrooms</span>
                                </li>
                                <li>
                                  <span>{product.propertyDetails.baths}</span>
                                  <span className="ms-1">Bathrooms</span>
                                </li>
                                <li>
                                  <span>{product.propertyDetails.area}</span>
                                  <span className="ms-1">square Ft</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        );
                      })}
                    </Slider>
                  </div>
                  {/* <!-- Popular Post Widget --> */}
                  {/* <!--
                  <div className="widget ltn__popular-post-widget">
                    <h4 className="ltn__widget-title ltn__widget-title-border-2">
                      Leatest Blogs
                    </h4>
                    <ul>
                      {latestdBlogs.map((blog, key) => {
                        const slug = productSlug(blog.title);
                        let imagecount = key + 1;

                        return (
                          <li key={key}>
                            <div className="popular-post-widget-item clearfix">
                              <div className="popular-post-widget-img">
                                <Link href={`/blog/${slug}`}>
                                  <img
                                    src={`/img/team/${imagecount}.jpg`}
                                    alt="#"
                                  />
                                </Link>
                              </div>
                              <div className="popular-post-widget-brief">
                                <h6>
                                  <Link href={`/blog/${slug}`}>
                                    {blog.title}
                                  </Link>
                                </h6>
                                <div className="ltn__blog-meta">
                                  <ul>
                                    <li className="ltn__blog-date">
                                      <Link href={`/blog/${slug}`}>
                                        <span>
                                          <FaCalendarAlt />
                                        </span>
                                        <span>{blog.date}</span>
                                      </Link>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  --> */}
                  <FollowUs title="Follow Us" />

                  {/* <!-- Tagcloud Widget --> */}
                  {/* <!--
                  <Tags title="Popular Tags" />
                  --> */}
                </aside>
              </Col>
            </Row>
          </Container>
        </div>
        {/* <!-- SHOP DETAILS AREA END -->

    <!-- CALL TO ACTION START (call-to-action-6) --> */}
        <div className="ltn__call-to-action-area call-to-action-6 before-bg-bottom">
          <Container>
            <Row>
              <Col xs={12}>
                <CallToAction />
              </Col>
            </Row>
          </Container>
        </div>
        {/* <!-- CALL TO ACTION END --> */}
      </Layout>

    </>
  );
}

export default ProductDetails;

export async function getStaticProps({ params }) {
  // get product data based on slug
  const product = products.filter(
    (single) => productSlug(single.title) === params.slug
  )[0];

  return { props: { product } };
}

export async function getStaticPaths() {
  // get the paths we want to pre render based on products
  const paths = products.map((product) => ({
    params: { slug: productSlug(product.title) },
  }));

  return { paths, fallback: false };
}
