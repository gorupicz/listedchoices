import Link from "next/link";
import Image from "next/image";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import TitleSection from "@/components/titleSection";
import { productSlug } from "@/lib/product";

function Feature({ servicebtn, iconTag, data, classes, headingClasses }) {
  
  const featureHeaderData = {
    title: data.title,
    subTitle: data.subtitle,
  }

  const featureBodyData = data.features;

  return (
    <>
      <div className={`about-us-info-wrap ${classes}`}>
        <Container>
          <Row>
            <Col xs={12}>
              <TitleSection
                titleSectionData={featureHeaderData}
                headingClasses={headingClasses}
              />
            </Col>
          </Row>
          <Row className="justify-content-center">
            {featureBodyData.map((item, key) => {
              const slug = productSlug(item.title);
              return (
                <Col key={key} xs={12} sm={6} lg={4}>
                  <Link
                    href={item.link}
                  >
                  <div
                    className={`ltn__feature-item ltn__feature-item-6 text-center bg-white  box-shadow-1 ${
                      item.active ? "active" : ""
                    }`}
                  >
                    <div className="ltn__feature-icon">
                      {iconTag ? (
                        <span>
                          <i className={`${item.icon}`}></i>
                        </span>
                      ) : (
                        <img
                          src={`/img/icons/icon-img/${item.img}`}
                          alt={`${item.title}`}
                        />
                      )}
                    </div>
                    <div className="ltn__feature-info">
                      <h3>
                        <Link 
                          href={item.link}
                        >
                          {item.title}
                        </Link>
                      </h3>
                      <p>{item.shortDescription}</p>

                      {servicebtn ? (
                        <Link
                          className="ltn__service-btn"
                          href={item.link}
                        >
                          {item.buttonText}
                          <i className="flaticon-right-arrow"></i>
                        </Link>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  </Link>
                </Col>
              );
            })}
          </Row>
        </Container>
      </div>
    </>
  );
}

export default Feature;
