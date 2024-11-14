import Link from "next/link";
import Image from "next/image";
import Slider from "react-slick";
import clsx from "clsx";
import { Fragment, useState, useEffect } from "react";
import Head from "next/head";
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
  FaXTwitter,  // X (formerly Twitter)
  FaFacebookF,
  FaUserAlt,
  FaEnvelope,
  FaGlobe,
  FaPencilAlt,
  FaCalendarAlt,
  FaAirbnb,
  FaYoutube,
  FaExclamationCircle,
  FaCircle,
  FaLinkedinIn,  // LinkedIn
  FaPinterestP,  // Pinterest
  FaSnapchatGhost,  // Snapchat
  FaTiktok,  // TikTok
  FaRedditAlien  // Reddit
} from "react-icons/fa";
import { Layout } from "@/layouts";
import { useSelector } from "react-redux";
import { getProducts, productSlug, getDiscountPrice, getDaysInPreviousMonth } from "@/lib/product";
import products from "@/data/products.json";
import { Container, Row, Col, Nav, Tab } from "react-bootstrap";
import RelatedProduct from "@/components/product/related-product";
import CallToAction from "@/components/callToAction";
import ModalVideo from "react-modal-video";
import { useRouter } from "next/router";
import prisma from "@/lib/prisma";
import { serializePrismaData, serializeMongoData } from '@/lib/serializationHelper';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'react-i18next';
import MessageModal from '@/components/modals/MessageModal';
import TooltipSpan from "@/components/Tooltips/TooltipSpan";
import ListingDataItem from '@components/properties/ListingDataItem';
import { useOGMetadata } from "@/context/OGMetadataContext";
import { getSession } from 'next-auth/react';

function ProductDetails({ productJSON, productMYSQL, productMONGO, followRequestStatus }) {
  const { products } = useSelector((state) => state.product);
  const { cartItems } = useSelector((state) => state.cart);
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { compareItems } = useSelector((state) => state.compare);
  const { getDateRanges } = require('/src/lib/dateRangeHelper'); 
  const { calculateNightsWithinPeriod } = require('/src/lib/NightsWithinPeriodHelper'); 
  const { t } = useTranslation('properties/[slug]'); // Use the appropriate namespace for translations

  const yearToDateTotalNights = () => {
    const updatedAt = new Date(productMONGO.updated_at);
    const { lastMonthEnd, yearToDateStart } = getDateRanges(updatedAt);
    
    const differenceInDays = calculateNightsWithinPeriod(yearToDateStart, lastMonthEnd, yearToDateStart, lastMonthEnd);
    
    return differenceInDays > 0 ? differenceInDays : 0;
  };

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
  const pageTitle = productMONGO.name + " - " + productMONGO.location;
  const pageDescription = productMONGO.shortDescription;
  const ogImage = productJSON.carousel[0]?.img || 'default-image.jpg';
  const [scroll, setScroll] = useState(0);
  const [sliderHeight, setSliderHeight] = useState(0);
    router
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

  const { data: session, status } = useSession();  // Get the session and status
  
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(false);

  // Initialize button label based on followRequestStatus
  const initialButtonLabel = session && status === "authenticated"
    ? followRequestStatus === 'ACCEPTED'
      ? t('cacButton.loggedFollowing')
      : followRequestStatus === 'PENDING'
        ? t('cacButton.loggedPending')
        : t('cacButton.loggedNotFollowing')
    : t('cacButton.notLogged');

  const [buttonLabel, setButtonLabel] = useState(t('cacButton.loading'));

  useEffect(() => {
    if (status === "authenticated") {
      const label = followRequestStatus === 'ACCEPTED'
        ? t('cacButton.loggedFollowing')
        : followRequestStatus === 'PENDING'
          ? t('cacButton.loggedPending')
          : t('cacButton.loggedNotFollowing');
      setButtonLabel(label);
    } else if (status === "unauthenticated") {
      setButtonLabel(t('cacButton.notLogged'));
    }
  }, [status, followRequestStatus]);

  function setCookie(name, value, days) {
    console.log("setting cookie:", name, value, days);
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax; Secure`;
  }

  const handleFollowButtonClick = async (redirectAfterAuthenticatedCookie = false) => {
    if (!session || status !== "authenticated") {
      setCookie('redirectAfterAuthenticated', window.location.pathname, 100); // Cookie expires in 1 day
      router.push('/register');
      return;
    }
    console.log("redirectAfterAuthenticatedCookie:", redirectAfterAuthenticatedCookie);
    if (followRequestStatus === 'ACCEPTED') {
      if(!redirectAfterAuthenticatedCookie) {
      console.log("unfollow message");
      setModalContent(t('modal.unfollowMessage'));
        setShowModal(true);
      } else {
        document.cookie = 'redirectAfterAuthenticated=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure'; //Delete cookie
      }
    } else if (followRequestStatus === 'PENDING') {
      if(!redirectAfterAuthenticatedCookie) {
        console.log("withdraw follow request message");
        setModalContent(t('modal.withdrawFollowRequestMessage'));
        setShowModal(true);
      } else {
        document.cookie = 'redirectAfterAuthenticated=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure'; //Delete cookie
      }
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
        setButtonLabel(t('cacButton.loggedPending'));
        setModalContent(t('modal.followRequestSentMessage'));
        setShowModal(true);
        redirectAfterAuthenticatedCookie && (document.cookie = 'redirectAfterAuthenticated=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure'); //Delete cookie
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

  const { setOGMetadataSet } = useOGMetadata();

  useEffect(() => {
    setOGMetadataSet(true);
  }, [setOGMetadataSet]);

  useEffect(() => {
    const redirectAfterAuthenticatedCookie = document.cookie.split('; ').find(row => row.startsWith('redirectAfterAuthenticated='));
    if (redirectAfterAuthenticatedCookie && session && status === "authenticated") {
      handleFollowButtonClick(redirectAfterAuthenticatedCookie);
    }
  }, []);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={`/img/img-slide/${ogImage}`} />
      </Head>
      <Layout 
        topbar={false} 
        breadcrumb={true} 
        breadcrumbProps={{
          property: productMONGO.name,
          location: productMONGO.location,
          manager: productMONGO.propertyManager.fullName
        }}
      >
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
                      <FaAirbnb /> <span style={{ textDecoration: `underline` }}>{t('links.airbnbListing')}</span>
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

                  <h4 className="title-2">{t('financials.title')}</h4>
                  <div className="property-detail-info-list section-bg-1 clearfix mb-60">
                    <ul>
                      <li>
                        <ListingDataItem
                          label={t('financials.rent')}
                          value={productMONGO.income.last12MonthsUSD}
                          followRequestStatus={followRequestStatus}
                          handleFollowButtonClick={handleFollowButtonClick}
                          buttonDisabled={buttonDisabled}
                        />
                      </li>
                        <li>
                        <ListingDataItem
                          label={t('financials.expenses')}
                          value={productMONGO.expenses.last_twelve_months}
                          tooltip={t('financials.expensesTooltip')}
                          followRequestStatus={followRequestStatus}
                          handleFollowButtonClick={handleFollowButtonClick}
                          buttonDisabled={buttonDisabled}
                        />
                        </li>
                      </ul>
                      <ul>
                        <li>
                          <ListingDataItem
                            label={t('financials.freeCashFlow')}
                            value={productMONGO.income.last12MonthsUSD - productMONGO.expenses.last_twelve_months}
                            followRequestStatus={followRequestStatus}
                            handleFollowButtonClick={handleFollowButtonClick}
                            buttonDisabled={buttonDisabled}
                          />
                        </li>
    <li>
                          <ListingDataItem
                            label={t('financials.assetValuation')}
                            value={productMONGO.price}
                            followRequestStatus={followRequestStatus}
                            handleFollowButtonClick={handleFollowButtonClick}
                            buttonDisabled={buttonDisabled}
                          />
    </li>
    <li>
                            <ListingDataItem
                            label={t('financials.returnPercentage')}
                            value={(productMONGO.income.last12MonthsUSD - productMONGO.expenses.last_twelve_months) / productMONGO.price * 100}
                            isCurrency={false}
                            followRequestStatus={followRequestStatus}
                            handleFollowButtonClick={handleFollowButtonClick}
                            buttonDisabled={buttonDisabled}
                            isBlurable={false}
                          />
                          </li>
                        </ul>
                      </div>
                      <h4 className="title-2">{t('vacationRentalPerformance.title')}</h4>
                      <div className="property-detail-info-list section-bg-1 clearfix mb-60">
                        <ul>
                          <li>
                            <label><b>{t('vacationRentalPerformance.occupancy.title')}</b></label>
                          </li>
                          <li>
                          <ListingDataItem
                            label={t('vacationRentalPerformance.occupancy.lastMonth')}
                            value={productMONGO.occupancy.lastMonthNights / 30 * 100}
                            isCurrency={false}
                            followRequestStatus={followRequestStatus}
                            handleFollowButtonClick={handleFollowButtonClick}
                            buttonDisabled={buttonDisabled}
                            isBlurable={false}
                          />
    </li>
    <li>
                          <ListingDataItem
                            label={t('vacationRentalPerformance.occupancy.last3Months')}
                            value={productMONGO.occupancy.last3MonthsNights / 90 * 100}
                            isCurrency={false}
                            followRequestStatus={followRequestStatus}
                            handleFollowButtonClick={handleFollowButtonClick}
                            buttonDisabled={buttonDisabled}
                          />
    </li>
    <li>
                          <ListingDataItem
                            label={t('vacationRentalPerformance.occupancy.yearToDate')}
                            value={productMONGO.occupancy.yearToDateNights / yearToDateTotalNights() * 100}
                            isCurrency={false}
                            followRequestStatus={followRequestStatus}
                            handleFollowButtonClick={handleFollowButtonClick}
                            buttonDisabled={buttonDisabled}
                          />
                          </li>
                        </ul>
                        <ul>
    <li>
                          <ListingDataItem
                            label={t('vacationRentalPerformance.adr')}
                            value={productMONGO.income.last12MonthsUSD / productMONGO.occupancy.last12MonthsNights}
                            tooltip={t('vacationRentalPerformance.adrTooltip')}
                            followRequestStatus={followRequestStatus}
                            handleFollowButtonClick={handleFollowButtonClick}
                            buttonDisabled={buttonDisabled}
                          />
    </li>
    <li>
                      <ListingDataItem
                        label={t('vacationRentalPerformance.revpar')}
                        value={productMONGO.income.last12MonthsUSD / 365}
                        tooltip={t('vacationRentalPerformance.revparTooltip')}
                        followRequestStatus={followRequestStatus}
                        handleFollowButtonClick={handleFollowButtonClick}
                        buttonDisabled={buttonDisabled}
                      />
                      </li>
                      <li>
                        <label style={{maxWidth: `100%`}}>
                          <Link
                            href="https://forms.gle/27foVLZWB7nhufNC9"
                            target="_blank"
                          >
                            {t('otherMetrics')}
                          </Link>
                        </label>
                      </li>
                    </ul>
                  </div>

                  <h4 className="title-2">{t('location')}</h4>
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
                  
                  <h4 className="title-2">{t('propertyVideo')}</h4>
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
                  
                  <h4 className="title-2 mb-10">{t('amenities')}</h4>

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
                  <h4 className="title-2">{t('blueprint')}</h4>
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

                  <h4 className="title-2">{t('relatedProperties')}</h4>
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
                            baseUrl="properties"
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
                            followRequestStatus === 'ACCEPTED' ? (
                              <span>${new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(productJSON.amountAvailable)} </span>
                            ) : followRequestStatus === 'PENDING' ? (
                              <TooltipSpan id="obfuscation-tooltip" title={t('pendingLoggedTooltip')}>
                                <span className="obfuscation-span">obfusca</span>
                              </TooltipSpan>
                            ) :
                              (!buttonDisabled ? (
                                <a onClick={handleFollowButtonClick}>
                                  <TooltipSpan id="obfuscation-tooltip" title={t('cacButton.loggedNotFollowing')}>
                                    <span className="obfuscation-span">obfusca</span>
                                  </TooltipSpan>
                                </a>
                              ) : (
                                  <TooltipSpan id="obfuscation-tooltip" title={t('pendingLoggedTooltip')}>
                                    <span className="obfuscation-span">obfusca</span>
                                  </TooltipSpan>
                              )
                            )
                          ) : (
                            <Link href='`/register?redirect=${encodeURIComponent(window.location.pathname)}`'>
                              <TooltipSpan id="obfuscation-tooltip" title={t('loginNotLoggedTooltip')}>
                                <span className="obfuscation-span">obfusca</span>
                              </TooltipSpan>
                            </Link>
                          )
                        }
                      {t('amountAvailable')}
                    </h4>
                    <button
                      className={clsx(
                        "theme-btn-1 btn btn-effect-1",
                        followRequestStatus === 'PENDING' ? "disabled" : ""
                      )}
                      id="main-call-to-action-at-product-page-for-gtm"
                      onClick={handleFollowButtonClick}
                      disabled={buttonDisabled}
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
                          {Object.entries(productMONGO.propertyManager.social).map(([key, url]) => {
                            let IconComponent;

                            switch (key) {
                              case 'facebook':
                                IconComponent = FaFacebookF;
                                break;
                              case 'instagram':
                                IconComponent = FaInstagram;
                                break;
                              case 'youtube':
                                IconComponent = FaYoutube;
                                break;
                              case 'twitter':
                                IconComponent = FaXTwitter;
                                break;
                              case 'linkedin':
                                IconComponent = FaLinkedinIn;
                                break;
                              case 'pinterest':
                                IconComponent = FaPinterestP;
                                break;
                              case 'snapchat':
                                IconComponent = FaSnapchatGhost;
                                break;
                              case 'tiktok':
                                IconComponent = FaTiktok;
                                break;
                              case 'reddit':
                                IconComponent = FaRedditAlien;
                                break;
                              default:
                                IconComponent = FaGlobe; // Generic icon for other social media
                            }

                            return (
                              <li key={key}>
                                <a href={url} title={key.charAt(0).toUpperCase() + key.slice(1)}>
                                  <IconComponent />
                                </a>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  </div>
                  {/* <!-- Form Widget --> */}
                  <div className="widget ltn__form-widget">
                    <h4 className="ltn__widget-title ltn__widget-title-border-2">
                      {t('contactForm.title').replace("{FirstName}", productMONGO.propertyManager.firstName)}
                    </h4>
                    <form action="#">
                      <input
                        type="text"
                        name="yourname"
                        placeholder={t('contactForm.namePlaceholder')}
                      />
                      <input
                        type="email"
                        name="youremail"
                        placeholder={t('contactForm.emailPlaceholder')}
                      />
                      <textarea
                        name="yourmessage"
                        placeholder={t('contactForm.messagePlaceholder')}
                      ></textarea>
                      <button type="submit" className="btn theme-btn-1 btn-effect-4">
                        {t('contactForm.button')}
                      </button>
                    </form>
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
        title={t('modal.title')}
        modalMessage={modalContent}
        confirmButtonText={followRequestStatus === 'ACCEPTED' || followRequestStatus === 'PENDING' ? t('modal.confirmButton') : t('modal.acceptButton')}
        cancelButtonText={followRequestStatus === 'ACCEPTED' || followRequestStatus === 'PENDING' ? t('modal.cancelButton') : null}
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
    },
  };
}