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
import Cookies from 'js-cookie';

function ProductDetails({ productJSON, productMYSQL, productMONGO, followRequestStatus, ogMetadata }) {
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

  const [isOpen, setOpen] = useState(false);

  const router = useRouter();
  const pageTitle = productMONGO.name + " - " + productMONGO.location;
  const pageDescription = productMONGO.shortDescription;
  const ogImage = productMONGO.photos[0]?.img;
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

  const handleFollowButtonClick = async (redirectAfterAuthenticatedCookie = false) => {
    if (!session || status !== "authenticated") {
      Cookies.set('redirectAfterAuthenticated', window.location.pathname, { expires: 1, path: '/' });
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

  // Determine the currency based on the cookie or default to language-based currency
  const currency = Cookies.get('currency') || (router.locale === 'es' ? 'MXN' : 'USD');

  // Function to get the correct currency value
  const getCurrencyValue = (valueUSD, valueMXN) => {
    return currency === 'USD' ? valueUSD : valueMXN;
  };

  const incomeLast12Months = getCurrencyValue(productMONGO.income.last12MonthsUSD, productMONGO.income.last12MonthsMXN);
  const expensesLast12Months = getCurrencyValue(productMONGO.expenses.last12MonthsUSD, productMONGO.expenses.last12MonthsMXN);
  const freeCashFlow = incomeLast12Months - expensesLast12Months;

  // Log the initial props to check their values
  console.log('Product JSON:', productJSON);
  console.log('Product MYSQL:', productMYSQL);
  console.log('Product MONGO:', productMONGO);

  // Log the ogImage to check its value
  console.log('OG Image:', ogImage);

  // Log each image in the carousel
  if (productMONGO.photos) {
    productMONGO.photos.forEach((photo, index) => {
      console.log(`Photo ${index}:`, photo.img);
      if (!photo.img) {
        console.error(`Photo ${index} is missing an image source.`);
      } 
    });
  }
  const propertyManagerImgIsExternalUrl = productMONGO.propertyManager.img && productMONGO.propertyManager.img.startsWith('http');
  const propertyManagerImg = propertyManagerImgIsExternalUrl ? productMONGO.propertyManager.img : `/img/team/${productMONGO.propertyManager.img}`;  

  // Log the product details carousel settings
  console.log('Carousel Settings:', productDetailsCarouselSettings);

  // Log the session and status
  console.log('Session:', session);
  console.log('Status:', status);

  // Log the follow request status
  console.log('Follow Request Status:', followRequestStatus);

  // Log the currency and calculated values
  console.log('Currency:', currency);
  console.log('Income Last 12 Months:', incomeLast12Months);
  console.log('Expenses Last 12 Months:', expensesLast12Months);
  console.log('Free Cash Flow:', freeCashFlow);

  return (
    <>
      <Head>
        <title>{ogMetadata.title}</title>
        <meta property="og:title" content={ogMetadata.title} />
        <meta property="og:description" content={ogMetadata.description} />
        <meta property="og:image" content={`/img/img-slide/${ogMetadata.image}`} />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
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
        <div className="ltn__img-slider-area mb-90 mt-0">
          <Container fluid className="px-0">
            <Slider
              {...productDetailsCarouselSettings}
              className="ltn__image-slider-5-active slick-arrow-1 slick-arrow-1-inner"
            >
              {productMONGO && productMONGO.photos && productMONGO.photos.map((single, key) => {
                // Check if the image source is a full URL or a relative path
                const isExternalUrl = single.img && single.img.startsWith('http');
                const imageSrc = isExternalUrl ? single.img : `/img/img-slide/${single.img || 'img/img-slide/Elegance/40.jpg'}`;
                
                return (
                  <div className="ltn__img-slide-item-4" key={key}>
                    <Link href="#">
                      <Image
                        src={imageSrc}
                        alt={`${single.title || 'Default Title'}`}
                        layout="fill"
                        objectFit="cover"
                        priority={key === 0}
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
                      href={productMONGO.listings.airbnb}
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
                          value={incomeLast12Months}
                          followRequestStatus={followRequestStatus}
                          handleFollowButtonClick={handleFollowButtonClick}
                          buttonDisabled={buttonDisabled}
                        />
                      </li>
                        <li>
                        <ListingDataItem
                          label={t('financials.expenses')}
                          value={expensesLast12Months}
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
                            value={freeCashFlow}
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
                            value={(freeCashFlow) / productMONGO.price * 100}
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
                      src={`${productMONGO.googleMaps}`}
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      allowFullScreen=""
                    ></iframe>
                  </div>
                  {/* <!-- APARTMENTS PLAN AREA END --> */}
                  
                  {productMONGO.videoId && (
                    <>
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
                    </>
                  )}
                  
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
                  
                  {productMONGO.blueprint && (
                    <>
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
                    </>
                  )}

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
                    
                    <h4 className="ltn__widget-title ltn__widget-title-border-2" style={{marginLeft: 10, marginRight: 15}}>
                      <span>{new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(productMONGO.followers)} </span>
                      {t('following')}
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
                        src={`${propertyManagerImg}`}
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
                            {" "}
                            <Link href="#">
                              {" "}
                              {new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(productMONGO.propertyManager.rating)} Rating
                            </Link>
                          </li>
                          <li className="review-total">
                            {" - "}
                            <Link href="#">
                              {" "}
                              {new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(productMONGO.propertyManager.reviews)} Reviews
                            </Link>
                          </li>
                          <li className="review-total">
                            {" - "}
                            <Link href="#">
                              {" "}
                              {new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(productMONGO.propertyManager.listings)} Listings
                            </Link>
                          </li>
                        </ul>
                      </div>
                      <p>{productMONGO.propertyManager.description}</p>

                      <div className="ltn__social-media">
                        <ul>
                          {Object.entries(productMONGO.propertyManager.social)
                            .filter(([key, url]) => url) // Filter out entries without a valid URL
                            .sort(([keyA], [keyB]) => keyA.localeCompare(keyB)) // Sort entries alphabetically by key
                            .map(([key, url]) => {
                              let IconComponent;

                              switch (key) {
                                case 'airbnb':
                                  IconComponent = FaAirbnb;
                                  break;
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
                                  <Link 
                                    href={url} 
                                    title={key.charAt(0).toUpperCase() + key.slice(1)} 
                                    target="_blank"
                                  >
                                    <IconComponent />
                                  </Link>
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
                    <form onSubmit={(e) => {
                      e.preventDefault(); // Prevent the default form submission
                      router.push('/register'); // Redirect to the register page
                    }}>
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
      ogMetadata: {
        title: `${serializedProductMONGO.name} - ${serializedProductMONGO.location}`,
        description: serializedProductMONGO.shortDescription,
        image: serializedProductMONGO.photos[0]?.img, // Fallback image
      },
    },
  };
}