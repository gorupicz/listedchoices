import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import HeaderTopInfo from "../headerTopInfo";
import HeaderSocialLinks from "../headerSocialLinks";
import LanguageDropDown from "../languageDropdown";

const HeaderTopBarTwo = function () {
  return (
    <>
      <div className="ltn__header-top-area top-area-color-white">
        <Container>
          <Row>
            <Col xs={12} md={7}>
              <HeaderTopInfo />
            </Col>
            <Col xs={12} md={5}>
              <div className="top-bar-right text-end">
                <div className="ltn__top-bar-menu mx-auto">
                  <ul>
                    <li>
                      <LanguageDropDown />
                    </li>

                    <li>
                      {/* <!-- ltn__social-media --> */}
                      <HeaderSocialLinks />
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

export default HeaderTopBarTwo;
