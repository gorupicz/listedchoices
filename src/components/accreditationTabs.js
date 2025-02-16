import { Tab, Nav, Row, Col } from "react-bootstrap";
import Image from "next/image";
import Link from "next/link";
import * as Icons from 'react-icons/fa';
import { FaCheck } from 'react-icons/fa';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';

const HistoryTabs = ({ slides, defaultActiveKey }) => {
  return (
    <Tab.Container defaultActiveKey={defaultActiveKey}>
      <div className="ltn__our-history-inner ltn__slide-item-bg-main-image">
        <div className="ltn__tab-menu text-uppercase">
          <Nav>
            {slides.map((slide, index) => (
              <Nav.Link key={index} eventKey={slide.eventKey}>
                {slide.tabMenuText}
              </Nav.Link>
            ))}
          </Nav>
        </div>
        <Tab.Content>
          {slides.map((slide, index) => {
            const IconComponent = Icons[slide.icon];
            return (
              <Tab.Pane key={index} eventKey={slide.eventKey}>
                <div className="ltn__product-tab-content-inner">
                  <Row>
                    <Col xs={12} lg={6} className="align-self-center">
                      <div className="about-us-img-wrap about-img-left">
                        <Image
                          src={slide.image}
                          alt="Image"
                          width={800}
                          height={570}
                          layout="responsive"
                        />
                        <div className="ltn__history-icon">
                          {IconComponent && <IconComponent />}
                        </div>
                      </div>
                    </Col>
                    <Col xs={12} lg={6} className="align-self-center">
                      <div className="about-us-info-wrap">
                        <div className="section-title-area">
                          <h6 className="section-subtitle section-subtitle-2 ltn__secondary-color">
                            {slide.subtitle}
                          </h6>
                          <h1 className="section-title mb-30">{slide.title}</h1>
                          <p>{slide.description}</p>
                        </div>
                        {slide.additionalDescription && (
                          <p>{slide.additionalDescription}</p>
                        )}
                      </div>
                      <div className="btn-wrapper">
                        <Link
                          href={`${baseUrl}${slide.buttonLink}`}
                          className={`btn theme-btn-1 btn-effect-4 ${slide.isInactive ? 'disabled' : ''}`}
                          id="main-call-to-action-at-home-for-gtm-tracking"
                        >
                          {slide.isInactive ? (
                            <>
                              <FaCheck /> {slide.inactiveButtonText}
                            </>
                          ) : (
                            slide.buttonText
                          )}
                        </Link>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Tab.Pane>
            );
          })}
        </Tab.Content>
      </div>
    </Tab.Container>
  );
};

export default HistoryTabs; 