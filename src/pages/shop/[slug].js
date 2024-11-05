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
import { Layout } from "@/layouts";
import { useSelector } from "react-redux";
import { getProducts, productSlug, getDiscountPrice, getDaysInPreviousMonth } from "@/lib/product";
import products from "@/data/products.json";
import { Container, Row, Col, Nav, Tab } from "react-bootstrap";
import RelatedProduct from "@/components/product/related-product";
import Tags from "@/components/tags";
import blogData from "@/data/blog";
import CallToAction from "@/components/callToAction";
import ModalVideo from "react-modal-video";
import { useRouter } from "next/router";
import prisma from "@/lib/prisma";
import { serializePrismaData, serializeMongoData } from '@/lib/serializationHelper';
import { useSession } from 'next-auth/react';  // Import the useSession hook
import propertyData from '@/data/properties/[slug].json';
import { getSession } from 'next-auth/react';
import MessageModal from '@/components/modals/MessageModal';
import Button from 'react-bootstrap/Button';

function ProductDetails({ productJSON, productMYSQL, productMONGO, followRequestStatus, propertyData }) {
  const { products } = useSelector((state) => state.product);
  const { cartItems } = useSelector((state) => state.cart);
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { compareItems } = useSelector((state) => state.compare);
  const { getDateRanges } = require('/src/lib/dateRangeHelper'); 
  const { calculateNightsWithinPeriod } = require('/src/lib/NightsWithinPeriodHelper'); 

const yearToDateTotalNights = () => {
  const updatedAt = new Date(productMONGO.updated_at);
  const { lastMonthEnd, yearToDateStart } = getDateRanges(updatedAt);
  
  const differenceInDays = calculateNightsWithinPeriod(yearToDateStart, lastMonthEnd, yearToDateStart, lastMonthEnd);
  
  return differenceInDays > 0 ? differenceInDays : 0;
};


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
    productMONGO.category[0],
    "popular",
    2
  );

  const topRatedProducts = getProducts(
    products,
    productMONGO.category[0],
    "topRated",
    2
  );
  const popularProducts = getProducts(
    products,
    productMONGO.category[0],
    "popular",
    4
  );

  const discountedPrice = getDiscountPrice(
    productMONGO.price,
  ).toFixed(2);

  const daysInPreviousMonth = getDaysInPreviousMonth(
    productMONGO.updated_at
  );


  const productPrice = productMONGO.price.toFixed(2);
  const cartItem = cartItems.find((cartItem) => cartItem.id === productMONGO.property_id);
  const wishlistItem = wishlistItems.find(
    (wishlistItem) => wishlistItem.id === productMONGO.property_id
  );
  const compareItem = compareItems.find(
    (compareItem) => compareItem.id === productMONGO.property_id
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
  const pageTitle = productMONGO.title + " - " + productMONGO.locantion;
  const pageDescription = productMONGO.shortDescription;
  const ogImage = productJSON.carousel[0].img;
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
  }, [router.isReady, productJSON]);

  const { data: session, status } = useSession();  // Get the session and status
  console.log('Session:', session);
  console.log('Status:', status);

  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(false);

  // Initialize button label based on followRequestStatus
  const initialButtonLabel = session && status === "authenticated"
    ? followRequestStatus === 'ACCEPTED'
      ? propertyData.cacButton.loggedFollowing
      : followRequestStatus === 'PENDING'
        ? propertyData.cacButton.loggedPending
        : propertyData.cacButton.loggedNotFollowing
    : propertyData.cacButton.notLogged;

  const [buttonLabel, setButtonLabel] = useState(initialButtonLabel);

  useEffect(() => {
    if (status === "authenticated") {
      const label = followRequestStatus === 'ACCEPTED'
        ? propertyData.cacButton.loggedFollowing
        : followRequestStatus === 'PENDING'
          ? propertyData.cacButton.loggedPending
          : propertyData.cacButton.loggedNotFollowing;
      setButtonLabel(label);
    }
  }, [status, followRequestStatus, propertyData]);

  const handleFollowButtonClick = async () => {
    if (!session || status !== "authenticated") {
      router.push('/register');
      return;
    }

    if (followRequestStatus === 'ACCEPTED') {
      setModalContent('Are you sure you want to unfollow this property?');
      setShowModal(true);
    } else if (followRequestStatus === 'PENDING') {
      setModalContent('Are you sure you want to withdraw your follow request?');
      setShowModal(true);
    } else {
      // Send follow request
      const response = await fetch('/api/follow-property', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          propertyId: productMYSQL.id,
          userId: session.user.id
         }),
      });

      if (response.ok) {
        setButtonDisabled(true); // Disable the button to prevent multiple requests
        setButtonLabel(propertyData.cacButton.loggedPending);
        setModalContent('We sent your follow request');
        setShowModal(true);
      }
    }
  };

  const handleFollowModalConfirm = async () => {

    if (followRequestStatus === 'ACCEPTED' || followRequestStatus === 'PENDING') {

      const response = await fetch('/api/update-follow-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          propertyId: productMYSQL.id,
          userId: session.user.id,
          followRequestStatus: followRequestStatus
        }),
      });

      if (response.ok) {
        const newStatus = response.json().newStatus;
      }
    }
    setShowModal(false);

  };

  return (
    <>
      <Layout 
        topbar={false} 
        breadcrumb={true} 
        breadcrumbProps={{
          property: productMONGO.name,
          location: productMONGO.location,
          manager: productMONGO.propertyManager.fullName
        }}
      >
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
          videoId={productMONGO.videoId}
          onClose={() => setOpen(false)}
        />
        {/* <!-- IMAGE SLIDER AREA START (img-slider-3) --> */}
        <div className="ltn__img-slider-area mb-90">
          <Container fluid className="px-0">
            <Slider
              {...productDetailsCarouselSettings}
              className="ltn__image-slider-5-active slick-arrow-1 slick-arrow-1-inner"
            >
              {productMONGO.photos.map((single, key) => {
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
                        (productJSON.featured ? (
                          <li className="ltn__blog-category">
                            <Link href="#">Featured</Link>
                          </li>
                        ) : (
                          ""
                        ),
                          productJSON.rent ? (
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
                  <div style={{display:`flex`, alignItems: `baseline`}}>
                  <h1 className="ltn__primary-color"> {productMONGO.name}</h1>
                  <label style={{display:`inline-block`, marginLeft: `18px`}}>
                    <Link
                      href={productJSON.vacationRentalDetails.listings.airbnb}
                      target="_blank"
                    >
                      <FaAirbnb /> <span style={{ textDecoration: `underline` }}>Airbnb listing</span>
                    </Link>
                  </label>
                  </div>
                  <label>
                    <span className="ltn__secondary-color">
                      <i className="flaticon-pin"></i>
                    </span>{" "}
                    {productMONGO.location}
                  </label>
                  <h4 className="title-2"> {productMONGO.title}</h4>
                  <p>{productMONGO.shortDescription}</p>

                  <h4 className="title-2">Financials (Past 12 months)</h4>
                  <div className="property-detail-info-list section-bg-1 clearfix mb-60">
                    <ul>
                      <li>
                        <label>{propertyData.financials.rent}:</label>
                        {
                          session && status === "authenticated" ? (
                            <span>${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(productMONGO.income.last12MonthsUSD)}</span>
                          ) : (
                            <Link href="/register">
                            <TooltipSpan id="obfuscation-tooltip" title={propertyData.loginTooltip}>
                              <span className="obfuscation-span">
                                obfusca
                              </span>
                            </TooltipSpan>
                            </Link>
                          )
                        }
                      </li>
                      <li>
                        <TooltipSpan title="{propertyData.financials.expensesTooltip}" id="expenses">
                          <label> 
                            {propertyData.financials.expenses}:{' '}
                            <FaExclamationCircle />
                          </label>
                        </TooltipSpan>
                        {
                          session && status === "authenticated" ? (
                            <span>${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(productMONGO.expenses.last_twelve_months)}</span>
                          ) : (
                            <Link href="/register">
                            <TooltipSpan id="obfuscation-tooltip" title={propertyData.loginTooltip}>
                              <span className="obfuscation-span">
                                obfusca
                              </span>
                            </TooltipSpan>
                            </Link>
                          )
                        }
                      </li>
                    </ul>
                    <ul>
                      <li>
                        <label>{propertyData.financials.freeCashFlow}:</label>
                        {
                          session && status === "authenticated" ? (
                            <span>${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(productMONGO.income.last12MonthsUSD - productMONGO.expenses.last_twelve_months)}</span>
                          ) : (
                            <Link href="/register">
                            <TooltipSpan id="obfuscation-tooltip" title={propertyData.loginTooltip}>
                              <span className="obfuscation-span">
                                obfusca
                              </span>
                            </TooltipSpan>
                            </Link>
                          )
                        }
                      </li>
                      <li>
                        <label>{propertyData.financials.assetValuation}:</label>
                        {
                          session && status === "authenticated" ? (
                            <span>${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(productMONGO.price)}</span>
                          ) : (
                            <Link href="/register">
                            <TooltipSpan id="obfuscation-tooltip" title={propertyData.loginTooltip}>
                              <span className="obfuscation-span">
                                obfusca
                              </span>
                            </TooltipSpan>
                            </Link>
                          )
                        }
                      </li>
                      <li>
                        <label>{propertyData.financials.returnPercentage}:</label> 
                          <span>{new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format((productMONGO.income.last12MonthsUSD - productMONGO.expenses.last_twelve_months)/productMONGO.price*100)}%</span>
                      </li>
                    </ul>
                  </div>
                  <h4 className="title-2">{propertyData.vacationRentalPerformance.title}</h4>
                  <div className="property-detail-info-list section-bg-1 clearfix mb-60">
                    <ul>
                      <li>
                        <label><b>{propertyData.vacationRentalPerformance.occupancy.title}</b></label>
                      </li>
                      <li>
                        <label>{propertyData.vacationRentalPerformance.occupancy.lastMonth}</label>
                        <span>{new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(productMONGO.occupancy.lastMonthNights / 30 *100)}%</span>
                      </li>
                      <li>
                        <label>{propertyData.vacationRentalPerformance.occupancy.last3Months}</label>
                        {
                          session && status === "authenticated" ? (
                            <span>{new Intl.NumberFormat('en-US', { maximumFractionDigits: 0   }).format(productMONGO.occupancy.last3MonthsNights / 90 * 100)}%</span>
                          ) : (
                            <Link href="/register">
                            <TooltipSpan id="obfuscation-tooltip" title={propertyData.loginTooltip}>
                              <span className="obfuscation-span">
                                obfusca
                              </span>
                            </TooltipSpan>
                            </Link>
                          )
                        }
                      </li>
                      <li>
                        <label>{propertyData.vacationRentalPerformance.occupancy.yearToDate}</label>
                        {
                          session && status === "authenticated" ? (
                            <span>{new Intl.NumberFormat('en-US', { maximumFractionDigits: 0   }).format(productMONGO.occupancy.yearToDateNights / yearToDateTotalNights() * 100 )}%</span>
                          ) : (
                            <Link href="/register">
                            <TooltipSpan id="obfuscation-tooltip" title={propertyData.loginTooltip}>
                              <span className="obfuscation-span">
                                obfusca
                              </span>
                            </TooltipSpan>
                            </Link>
                          )
                        }
                      </li>
                    </ul>
                    <ul>
                      <li>
                        <TooltipSpan title={propertyData.vacationRentalPerformance.adrTooltip} id="adr">
                        <label>{propertyData.vacationRentalPerformance.adr}{' '}
                            <FaExclamationCircle />
                          </label>
                        </TooltipSpan>
                        {
                          session && status === "authenticated" ? (
                            <span>${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(productMONGO.income.last12MonthsUSD / productMONGO.occupancy.last12MonthsNights)}</span>
                          ) : (
                            <Link href="/register">
                            <TooltipSpan id="obfuscation-tooltip" title={propertyData.loginTooltip}>
                              <span className="obfuscation-span">
                                obfusca
                              </span>
                            </TooltipSpan>
                            </Link>
                          )
                        }
                      </li>
                      <li>
                        <TooltipSpan title={propertyData.vacationRentalPerformance.revparTooltip} id="revpan">
                          <label> 
                            {propertyData.vacationRentalPerformance.revpar}{' '}
                            <FaExclamationCircle />
                          </label>
                        </TooltipSpan> 
                        {
                          session && status === "authenticated" ? (
                            <span>${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(productMONGO.income.last12MonthsUSD / 365)}</span>
                          ) : (
                            <Link href="/register">
                            <TooltipSpan id="obfuscation-tooltip" title={propertyData.loginTooltip}>
                              <span className="obfuscation-span">
                                obfusca
                              </span>
                            </TooltipSpan>
                            </Link>
                          )
                        }
                      </li>
                      <li>
                        <label style={{maxWidth: `100%`}}>
                          <Link
                            href="https://forms.gle/27foVLZWB7nhufNC9"
                            target="_blank"
                          >
                            {propertyData.otherMetrics}
                          </Link>
                        </label>
                      </li>
                    </ul>
                  </div>

                  <h4 className="title-2">{propertyData.location}</h4>
                  <div className="property-details-google-map mb-60">
                    <iframe
                      src={`${productMYSQL.google_maps}`}
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      allowFullScreen=""
                    ></iframe>
                  </div>
                  {/* <!-- APARTMENTS PLAN AREA END --> */}
                  
                  <h4 className="title-2">{propertyData.propertyVideo}</h4>
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
                  
                  <h4 className="title-2 mb-10">{propertyData.amenities}</h4>

                  <div className="property-details-amenities mb-60">
                    <div className="row">
                      <div className="col-lg-4 col-md-6">
                        <div className="ltn__menu-widget">
                          <ul>
                            {productMONGO.amenities1.map((single, key) => {
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
                            {productMONGO.amenities2.map((single, key) => {
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
                            {productMONGO.amenities3.map((single, key) => {
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
                  <h4 className="title-2">{propertyData.blueprint}</h4>
                  {/* <!-- APARTMENTS PLAN AREA START --> */}
                  <div className="ltn__apartments-plan-area product-details-apartments-plan mb-60">
                    <Tab.Container defaultActiveKey="first">
                      <Tab.Content>
                        <Tab.Pane eventKey="first">
                          <div className="ltn__apartments-tab-content-inner">
                            <div className="row">
                              <div className="col-lg-7" style={{ width: `100%`, height: `312px` }}>
                                <div className="apartments-plan-img">
                                  <Image 
                                    src={productMONGO.blueprint} 
                                    alt="#" 
                                    fill={true}
                                    style={{objectFit: 'cover'}}
                                    />
                                </div>
                              </div>
                            </div>
                          </div>
                        </Tab.Pane>
                      </Tab.Content>
                    </Tab.Container>
                  </div>

                  <h4 className="title-2">{propertyData.relatedProperties}</h4>
                  <Row>
                    {relatedProducts.map((data, key) => {
                      const slug = productSlug(data.title);
                      const discountedPrice = getDiscountPrice(
                        productMONGO.price,
                        productJSON.discount
                      ).toFixed(2);
                      const productPrice = productMONGO.price.toFixed(2);
                      const cartItem = cartItems.find(
                        (cartItem) => cartItem.id === productMONGO.property_id
                      );
                      const wishlistItem = wishlistItems.find(
                        (wishlistItem) => wishlistItem.id === productMONGO.property_id
                      );
                      const compareItem = compareItems.find(
                        (compareItem) => compareItem.id === productMONGO.property_id
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
                      {
                          session && status === "authenticated" ? (
                            <span>${new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(productJSON.amountAvailable)} </span>
                          ) : (
                            <Link href="/register">
                            <TooltipSpan id="obfuscation-tooltip" title={propertyData.loginTooltip}>
                              <span className="obfuscation-span">
                                obfusca
                              </span>
                            </TooltipSpan>
                            </Link>
                          )
                        }
                      {propertyData.amountAvailable}
                    </h4>
                    <button
                      className={clsx(
                        "theme-btn-1 btn btn-effect-1",
                        followRequestStatus === 'PENDING' ? "disabled" : ""
                      )}
                      id="main-call-to-action-at-product-page-for-gtm"
                      onClick={handleFollowButtonClick}
                    >
                      {buttonLabel}
                    </button>
                  </div>
                  {/* <!-- Author Widget --> */}
                  <div className="widget ltn__author-widget">
                    <div className="ltn__author-widget-inner text-center">
                      <img
                        src={`/img/team/${productMONGO.propertyManager.img}`}
                        alt={`${productMONGO.propertyManager.fullName}`}
                      />
                      <h5>{productMONGO.propertyManager.fullName}</h5>
                      <small>{productMONGO.propertyManager.designation}</small>
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
                              ( {productMONGO.propertyManager.raiting} Reviews )
                            </Link>
                          </li>
                        </ul>
                      </div>
                      <p>{productMONGO.propertyManager.description}</p>

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
                  {/* <!-- Form Widget --> */}
                  <div className="widget ltn__form-widget">
                    <h4 className="ltn__widget-title ltn__widget-title-border-2">
                      {propertyData.contactForm.title.replace("{FirstName}", productMONGO.propertyManager.firstName)}
                    </h4>
                    <form action="#">
                      <input
                        type="text"
                        name="yourname"
                        placeholder={propertyData.contactForm.namePlaceholder}
                      />
                      <input
                        type="text"
                        name="youremail"
                        placeholder={propertyData.contactForm.emailPlaceholder}
                      />
                      <textarea
                        name="yourmessage"
                        placeholder={propertyData.contactForm.messagePlaceholder}
                      ></textarea>
                      <button type="submit" className="btn theme-btn-1 btn-effect-4">
                        {propertyData.contactForm.button}
                      </button>
                    </form>
                  </div>
                  {/* <!-- Menu Widget (Category) --> */}
                  <div className="widget ltn__menu-widget ltn__menu-widget-2--- ltn__menu-widget-2-color-2---">
                    <h4 className="ltn__widget-title ltn__widget-title-border-2">
                      {propertyData.topCategories.title}
                    </h4>
                    <ul>
                      <li>
                        <Link href="#">
                          {propertyData.topCategories.apartments} <span>(26)</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          {propertyData.topCategories.pictureStudio} <span>(30)</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          {propertyData.topCategories.office} <span>(71)</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          {propertyData.topCategories.luxaryVilas} <span>(56)</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          {propertyData.topCategories.duplexHouse} <span>(60)</span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                  {/* <!-- Popular Product Widget --> */}
                  <div className="widget ltn__popular-product-widget">
                    <h4 className="ltn__widget-title ltn__widget-title-border-2">
                      {propertyData.popularProperties.title}
                    </h4>

                    <Slider
                      {...popular_product}
                      className="row ltn__popular-product-widget-active slick-arrow-1"
                    >
                      {/* <!-- ltn__product-item --> */}

                      {popularProducts.map((productJSON, key) => {
                        const slug = productSlug(productMONGO.name);
                        return (
                          <div
                            key={key}
                            className="ltn__product-item ltn__product-item-4 ltn__product-item-5 text-center---"
                          >
                            <div className="product-img">
                              <Link href={`/shop/${slug}`}>
                                <img
                                  src={`/img/product-3/${productJSON.productImg}`}
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
                              <h2 className="product-title">
                                <Link href={`/shop/${slug}`}>
                                  {productMONGO.name}
                                </Link>
                              </h2>
                              <div className="product-img-location">
                                <ul>
                                  <li>
                                    <Link href="product-details">
                                      <i className="flaticon-pin"></i>
                                      {productMONGO.location}
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                              <ul className="ltn__list-item-2--- ltn__list-item-2-before--- ltn__plot-brief">
                                <li>
                                  <span>
                                    {productJSON.propertyDetails.bedrooms}
                                  </span>
                                  <span className="ms-1">Bedrooms</span>
                                </li>
                                <li>
                                  <span>{productJSON.propertyDetails.baths}</span>
                                  <span className="ms-1">Bathrooms</span>
                                </li>
                                <li>
                                  <span>{productJSON.propertyDetails.area}</span>
                                  <span className="ms-1">square Ft</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        );
                      })}
                    </Slider>
                  </div>
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

      <MessageModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        title={propertyData.modalTitle}
        modalMessage={modalContent}
        confirmButtonText={followRequestStatus === 'ACCEPTED' || followRequestStatus === 'PENDING' ? propertyData.confirmButton : propertyData.acceptButton}
        cancelButtonText={followRequestStatus === 'ACCEPTED' || followRequestStatus === 'PENDING' ? propertyData.cancelButton : null}
        onConfirm={followRequestStatus === 'ACCEPTED' || followRequestStatus === 'PENDING' ? handleFollowModalConfirm : () => setShowModal(false)}
      />
    </>
  );
}

export default ProductDetails;



export async function getServerSideProps({ params, req }) {
  const session = await getSession({ req });

  // 1. Fetch property details using Prisma from MySQL
  const productMYSQL = await prisma.property.findUnique({
    where: {
      slug: params.slug,
    },
  });
  // 2. If no product is found in MySQL, return 404
  if (!productMYSQL) {
    return {
      notFound: true,
    };
  }

  // 3. Fetch listing details from MongoDB
  const connectMongoDB = require('mongodb/mongoClient');
  const db = await connectMongoDB();
  const productMONGO = await db.collection('listings').findOne({
    property_id: productMYSQL.id,
  });

  if (!productMONGO) {
    return {
      notFound: true,
    };
  }

  // Serialize both MySQL (Prisma) and MongoDB data
  const serializedProductMYSQL = serializePrismaData(productMYSQL);
  const serializedProductMONGO = serializeMongoData(productMONGO);


  // 4. Fetch data from products.json (find the product by slug)
  const productJSON = products.find(
    (singleProduct) => productSlug(singleProduct.title) === params.slug
  );

  let followRequestStatus = null;

  if (session) {
    const userId = session.user.id; // Assuming session contains user ID
    const followRequest = await prisma.propertyFollowRequest.findFirst({
      where: {
        requesterId: userId,
        propertyId: productMYSQL.id,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    followRequestStatus = followRequest ? followRequest.currentStatus : null;
  }

  // 5. Return the three separate products as props
  return {
    props: {
      productJSON,
      productMYSQL: serializedProductMYSQL,
      productMONGO: serializedProductMONGO,
      followRequestStatus,
      propertyData,  // Pass the property data to the component
    },
  };
}