import Link from "next/link";
import Image from "next/image";
import { Col, Container, Row } from "react-bootstrap";
import { FaHome, FaAngleRight } from "react-icons/fa";
import breadcrumbTexts from "../../data/breadcrumbs/index.json";

const BreadCrumb = ({ property, location, manager } ) => {
  return (
    <>
      <div className="text-left section-bg-1-hero ltn__paragraph-color hide-on-mobile">
        <Container>
          <Row>
            <Col xs={12}>
              <div className="ltn__breadcrumb-inner">
                <div className="ltn__breadcrumb-list">
                  <ul>
                    <li>
                      <Link href="/">
                        <span>
                          <FaHome className="me-2" />
                        </span>
                        <FaAngleRight />
                      </Link>
                    </li>
                    <li>
                      <Link href="/shop">
                        <span className="me-2">{breadcrumbTexts.properties}</span>
                        <FaAngleRight />
                      </Link>
                    </li>
                    <li>
                      <Link href="/shop">
                        <span className="me-2">{location}</span>
                        <FaAngleRight />
                      </Link>
                    </li>
                    <li>
                      <Link href="#">
                        <span className="me-2">{property}</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="#">
                        <span className="me-2">
                          {breadcrumbTexts.visitInventory.replace("{manager}", manager)}
                        </span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default BreadCrumb;
