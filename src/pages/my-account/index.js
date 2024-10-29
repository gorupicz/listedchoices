import { Layout } from "@/layouts";
import { Container, Row, Col, Nav, Tab } from "react-bootstrap";
import { FaHome, FaUserAlt, FaMapMarkerAlt, FaList, FaHeart, FaMapMarked, FaDollarSign, FaSignOutAlt, FaLock } from "react-icons/fa";
import myAccountData from "@/data/my-account/index.json";
import Link from "next/link";
import { signOut, getSession } from "next-auth/react";
import prisma from "@/lib/prisma"; // Ensure you have a prisma client setup

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id, // Use the user ID from the session
    },
    select: {
      first_name: true,
    },
  });

  return {
    props: {
      userName: user.first_name,
    },
  };
}

function MyAccount({ userName }) {
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
                          {myAccountData.tabs.map((tab, index) => (
                            <Tab.Pane key={index} eventKey={tab.eventKey}>
                              <div className="ltn__myaccount-tab-content-inner">
                                <p>{tab.text.replace("{userName}", userName)}</p>
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
