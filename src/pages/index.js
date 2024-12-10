import { useState } from "react";
import { Layout } from "@/layouts";
import { Container, Row, Col } from "react-bootstrap";
import Feature from "@/components/features";
import Hero from "@/components/hero";
import AboutUsSection from "@/components/aboutUs";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import ModalVideo from "react-modal-video";
import CallToAction from "@/components/callToAction";
import { useTranslation } from 'react-i18next';

function Home() {
  const [isOpen, setOpen] = useState(false);
  
  const { t: tHero } = useTranslation('home/hero');
  const heroData = tHero('slides', { returnObjects: true });

  console.log('Hero Data:', heroData);

  const { t: tFeature } = useTranslation('home/feature');
  const featureData = {
    title: tFeature('title'),
    subtitle: tFeature('subtitle'),
    features: tFeature('features', { returnObjects: true }),
  };

    const { t: tAboutUs } = useTranslation('home/aboutUs');

  const aboutUsData = {
    title: tAboutUs('title'),
    subtitle: tAboutUs('subtitle'),
    description: tAboutUs('description'),
    image: tAboutUs('image'),
    features: tAboutUs('features', { returnObjects: true }),
  };

  const SlickArrowLeft = ({ currentSlide, slideCount, ...props }) => (
    <button
      {...props}
      className={
        "slick-prev slick-arrow" +
        (currentSlide === 0 ? " slick-disabled" : "")
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

  return (
    <Layout topbar={false}>

      <ModalVideo
        channel="youtube"
        autoplay
        isOpen={isOpen}
        videoId="LjCzPp-MK48"
        onClose={() => setOpen(false)}
      />
      {/* <!-- SLIDER AREA START (slider-11) --> */}
      <div className="ltn__slider-area ltn__slider-11 section-bg-1 section-bg-1-hero">
        <Hero data={heroData} />
      </div>
      {/* <!-- SLIDER AREA END -->


    {/* <!-- FEATURE AREA START ( Feature - 6) --> */}
      <Feature
        servicebtn={true}
        iconTag={true}
        data={featureData}
        classes=""
        headingClasses=""
      />
      
      {/* <!-- FEATURE AREA END --> */}


    {/*  <!-- ABOUT US AREA START --> */}
      <div className="ltn__about-us-area pt-50 pb-30 ">
        <AboutUsSection 
          data={aboutUsData}
        />
      </div>
    {/* <!-- CALL TO ACTION START (call-to-action-6) --> */}
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
  );
}
export default Home;