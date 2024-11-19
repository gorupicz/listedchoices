import Link from "next/link";
import Image from "next/image";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function AboutUsSection({ data }) {
  return (
    <>
      <Container>
        <Row>
          <Col xs={12} lg={6} className="align-self-center">
            <div className="about-us-img-wrap about-img-left">
              <Image
                src={data.image.src}
                alt={data.image.alt}
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
                  {data.subtitle}
                </h6>
                <h1 className="section-title">
                  {data.title}
                </h1>
                <p>
                  {data.description}
                </p>
              </div>
              {data.features.map((feature, index) => (
                <div key={index} className="ltn__feature-item ltn__feature-item-3">
                  <div className="ltn__feature-icon">
                    <span>
                      <i className={feature.flaticon}></i>
                    </span>
                  </div>
                  <div className="ltn__feature-info">
                    <h4>
                      <Link href={feature.link}>
                        {feature.title}
                      </Link>
                    </h4>
                    <p>
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default AboutUsSection;
