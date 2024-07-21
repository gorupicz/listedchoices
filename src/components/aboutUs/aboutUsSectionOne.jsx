import Link from "next/link";
import Image from "next/image";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function AboutUsSectionOne() {
  return (
    <>
      <Container>
        <Row>
          <Col xs={12} lg={6} className="align-self-center">
            <div className="about-us-img-wrap about-img-left">
              <Image
                src="/img/others/11.png"
                alt="When I retire, I will make a living from this."
                width={626}
                height={800}
                layout="responsive"
              />
            </div>
          </Col>
          <Col xs={12} lg={6} className="align-self-center">
            <div className="about-us-info-wrap">
              <div className="section-title-area ltn__section-title-2--- mb-30">
                <h6 className="section-subtitle section-subtitle-2--- ltn__secondary-color">
                  Vive de tus propiedades
                </h6>
                <h1 className="section-title">
                  Gana dividendos mensuales
                </h1>
                <p>
                  Invest in turn-key properties with active track-record in Airbnb and Vrbo, managed by proffesional property managers
                </p>
              </div>
              <div className="ltn__feature-item ltn__feature-item-3">
                <div className="ltn__feature-icon">
                  <span>
                    <i className="flaticon-house-4"></i>
                  </span>
                </div>
                <div className="ltn__feature-info">
                  <h4>
                    <Link href="https://quarter-nextjs.netlify.app/service/buy-a-home">
                      Only the best properties, curated by our experts
                    </Link>
                  </h4>
                  <p>
                    Listed properties go through our rigurous process to ensure product-market fit and maximize returns
                  </p>
                </div>
              </div>
              <div className="ltn__feature-item ltn__feature-item-3">
                <div className="ltn__feature-icon">
                  <span>
                    <i className="flaticon-call-center-agent"></i>
                  </span>
                </div>
                <div className="ltn__feature-info">
                  <h4>
                    <Link href="https://quarter-nextjs.netlify.app/service/buy-a-home">
                      Furnished and optimized for tourists
                    </Link>
                  </h4>
                  <p>
                    From different coffee makers to hypoallergenic bedding, we focus on providing a memorable and cost-effective guest experience
                  </p>
                </div>
              </div>
              <div className="ltn__feature-item ltn__feature-item-3">
                <div className="ltn__feature-icon">
                  <span>
                    <i className="flaticon-maps-and-location"></i>
                  </span>
                </div>
                <div className="ltn__feature-info">
                  <h4>
                    <Link href="https://quarter-nextjs.netlify.app/service/buy-a-home">
                      Location rules, always
                    </Link>
                  </h4>
                  <p>
                    We only list properties with direct sea views and walking distance to beach
                  </p>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default AboutUsSectionOne;
