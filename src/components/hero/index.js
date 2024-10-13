import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Slider from "react-slick";
import ModalVideo from "react-modal-video";
import {
  FaPlay,
  FaShip,
  FaArrowRight,
  FaArrowLeft,
  FaDribbble,
  FaTwitter,
  FaFacebookF,
} from "react-icons/fa";
import { Col, Container, Row } from "react-bootstrap";

function Hero ({ data }) {
  
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

  const [nav1, setNav1] = useState();
  const [nav2, setNav2] = useState();

  const Herosettings = {
    dots: false,
    arrows: false,
    infinite: true,
    autoplay: false,
    autoplaySpeed: 10000,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <SlickArrowLeft />,
    nextArrow: <SlickArrowRight />,
    responsive: [
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          dots: false,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          dots: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          dots: false,
        },
      },
      {
        breakpoint: 575,
        settings: {
          arrows: false,
          dots: false,
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  const Navsettings = {
    lazyLoad: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 1,
    centerMode: false,
    centerPadding: "0px",
    dots: false /* image slide dots */,
    arrows: false /* image slide arrow */,
    focusOnSelect: false,
    prevArrow: <SlickArrowLeft />,
    nextArrow: <SlickArrowRight />,
    responsive: [
      {
        breakpoint: 1600,
        settings: {
          arrows: false,
          dots: false,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          arrows: false,
          dots: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          dots: false,
        },
      },
      {
        breakpoint: 575,
        settings: {
          arrows: false,
          dots: false,
        },
      },
    ],
  };

  const [isOpen, setOpen] = useState(false);
  return (
    <>
      <ModalVideo
        channel="youtube"
        autoplay
        mute={true}
        isOpen={isOpen}
        videoId="xpPcAUMCko4"
        onClose={() => setOpen(false)}
      />

      <div className="ltn__slider-11-inner position-relative">
        <Slider
          {...Herosettings}
          asNavFor={nav2}
          ref={(slider1) => setNav1(slider1)}
          className="ltn__slider-11-active"
        >
          {data.map((item, key) => {

            let Title = item.Title;
            const titleWords = Array.isArray(item.titleWord) ? item.titleWord : [item.titleWord];
            const regexPattern = '(' + titleWords.join('|') + ')';
            const titleParts = Title.split(new RegExp(regexPattern, 'gi'));

            return (
              <div
                className="ltn__slide-item ltn__slide-item-2 ltn__slide-item-3-normal ltn__slide-item-3 ltn__slide-item-11"
                key={key}
              >
                <div
                  className={`ltn__slide-item-inner ${
                    item.variationLeft ? "text-right text-end" : ""
                  }`}
                >
                  <Container className="container">
                    <Row className="row">
                      <Col xs={12} className="align-self-center">
                        <div className="slide-item-info">
                          <div className="slide-item-info-inner">
                            <h6 className="slide-sub-title">
                              <span>
                                <FaArrowRight />
                              </span>
                              {item.subtitle}
                            </h6>
                            <h1 className="slide-title">
                              {titleParts.map((part, index) => {
                                // Check if the current part matches any word in titleWords
                                const isHighlighted = titleWords.some(word => part.toLowerCase() === word.toLowerCase());

                                return isHighlighted ? (
                                  <span key={index} className="slide-highlightedWord">
                                    {part}
                                  </span>
                                ) : (
                                  <span key={index}>{part}</span>
                                );
                              })}

                            </h1>
                            <div className="slide-brief ">
                              <h4>{item.Desc}</h4>
                            </div>
                            <div className="btn-wrapper">
                              <Link
                                href={item.buttonLink}
                                className="btn theme-btn-1 btn-effect-4"
                                id="main-call-to-action-at-home-for-gtm-tracking"
                              >
                                {item.buttonText}
                              </Link>

                              {item.videoButton ? (
                                <button
                                  onClick={() => setOpen(true)}
                                  className="ltn__video-play-btn bg-white"
                                >
                                  <FaPlay className="icon-play  ltn__secondary-color" />
                                </button>
                              ) : (
                                <Link
                                  href={item.learnMoreButtonLink}
                                  className="btn btn-white btn-effect-4"
                                >
                                  {item.learnMoreButtonText}
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                        <div
                          className={`slide-item-img ${
                            item.variationLeft ? "slide-img-left" : ""
                          }`}
                        >
                          <div>{item.caption}</div>
                          <Image
                            src={`/img/slider/${item.heroimage}`}
                            alt={`${item.subtitle}`}
                            width={830}
                            height={960}
                            layout="responsive"
                          />
                          

                        </div>
                      </Col>
                    </Row>
                  </Container>
                </div>
              </div>
            );
          })}
        </Slider>

        {/* <!-- slider-sticky-icon --> */}
        <div className="slider-sticky-icon-2">
          <ul>
            <li>
              <Link href="#">
                <FaFacebookF />
              </Link>
            </li>
            <li>
              <Link href="#">
                <FaTwitter />
              </Link>
            </li>
            <li>
              <Link href="#">
                <FaDribbble />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Hero;
