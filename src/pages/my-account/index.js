import { Layout } from "@/layouts";
import { Container, Row, Col, Nav, Tab } from "react-bootstrap";
import { FaHome, FaUserAlt, FaMapMarkerAlt, FaList, FaHeart, FaMapMarked, FaDollarSign, FaSignOutAlt, FaLock } from "react-icons/fa";
import myAccountData from "@/data/my-account/index.json";
import Link from "next/link";
import { signOut } from "next-auth/react";

function MyAccount() {
  const handleLogout = () => {
    signOut({
      callbackUrl: "/login" // Redirects to the login page after sign-out
    });
  };

  return (
    <>
      <Layout topbar={false}>
        {/* <!-- MY ACCOUNT AREA START --> */}
        <div className="liton__wishlist-area pb-70 pt-50">
          <Container>
            <Row>
              <Col xs={12}>
                <div className="ltn__product-tab-area">
                  <Tab.Container
                    id="left-tabs-example"
                    defaultActiveKey="ltn_tab_1_1"
                  >
                    <Row>
                      <Col xs={12} lg={4}>
                        <div className="ltn__tab-menu-list mb-50">
                          <Nav variant="pills" className="flex-column">
                            {myAccountData.tabs.map((tab, index) => (
                              <Nav.Item key={index}>
                                <Nav.Link eventKey={tab.eventKey}>
                                  {tab.label} {tab.icon && <tab.icon />}
                                </Nav.Link>
                              </Nav.Item>
                            ))}
                            <Nav.Item>
                              <Nav.Link onClick={handleLogout}>
                                {myAccountData.logoutLabel} <FaSignOutAlt />
                              </Nav.Link>
                            </Nav.Item>
                          </Nav>
                        </div>
                      </Col>
                      <Col xs={12} lg={8}>
                        <Tab.Content>
                          {myAccountData.tabContent.map((content, index) => (
                            <Tab.Pane key={index} eventKey={content.eventKey}>
                              <div className="ltn__myaccount-tab-content-inner">
                                <p>{content.text}</p>
                              </div>
                            </Tab.Pane>
                          ))}
                        </Tab.Content>
                      </Col>
                    </Row>
                  </Tab.Container>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
        {/* <!-- MY ACCOUNT AREA END --> */}
      </Layout>
    </>
  );
}

export default MyAccount;
