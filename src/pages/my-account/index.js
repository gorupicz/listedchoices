import { Layout } from "@/layouts";
import { Container, Row, Col, Nav, Tab } from "react-bootstrap";
import { FaHome, FaUserAlt, FaMapMarkerAlt, FaList, FaHeart, FaMapMarked, FaDollarSign, FaSignOutAlt, FaLock } from "react-icons/fa";
import myAccountData from "@/data/my-account/index.json";
import Link from "next/link";
import { signOut, getSession, useSession } from "next-auth/react";
import React, { useEffect } from "react";

// Map icon names to React components
const iconMap = {
    FaHome: FaHome,
    FaUserAlt: FaUserAlt,
    FaMapMarkerAlt: FaMapMarkerAlt,
    FaList: FaList,
    FaHeart: FaHeart,
    FaMapMarked: FaMapMarked,
    FaDollarSign: FaDollarSign,
    FaLock: FaLock
};

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

  return {
    props: {},
  };
}

function MyAccount() {
  const { data: session, status } = useSession(); // Get session data

  // Debugging useEffect to log component mounts and updates
  useEffect(() => {
    console.log('MyAccount component mounted or updated');
    
    // Optional: Return a cleanup function to log when the component unmounts
    return () => {
      console.log('MyAccount component unmounted');
    };
  }, [session, status]); // Dependencies array to track changes

  if (status === 'loading') {
    return <div>Loading...</div>; // Handle loading state
  }

  const userName = session?.user?.first_name || 'Guest'; // Get first_name from session

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
                                  {tab.label} {tab.icon && React.createElement(iconMap[tab.icon])}
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
