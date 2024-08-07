import { Layout } from "@/layouts";
import { Container, Row, Col } from "react-bootstrap";
import ShopBreadCrumb from "@/components/breadCrumbs/shop";
import CallToAction from "@/components/callToAction";

function OrderTracking() {
  return (
    <>
      <Layout topbar={true}>
        <ShopBreadCrumb
          title="Order Tracking"
          sectionPace=""
          currentSlug="Order Tracking"
        />

        {/* <!-- LOGIN AREA START --> */}
        <div className="ltn__login-area mb-120">
          <Container>
            <Row>
              <Col xs={12} lg={{ span: 8, offset: 2 }}>
                <div className="account-login-inner section-bg-1">
                  <form action="#" className="ltn__form-box contact-form-box">
                    <p className="text-center">{`To track your order please enter your Order ID in the box below and press the "Track Order" button. This was given to you on your receipt and in the confirmation email you should have received. `}</p>
                    <label>Order ID</label>
                    <input
                      type="text"
                      name="email"
                      placeholder="Found in your order confirmation email."
                    />
                    <label>Billing email</label>
                    <input
                      type="text"
                      name="email"
                      placeholder="Email you used during checkout."
                    />
                    <div className="btn-wrapper mt-0 text-center">
                      <button
                        className="btn theme-btn-1 btn-effect-1 text-uppercase"
                        type="submit"
                      >
                        Track Order
                      </button>
                    </div>
                  </form>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
        {/* <!-- LOGIN AREA END --> */}

        <div className="ltn__call-to-action-area call-to-action-6 before-bg-bottom">
          <Container>
            <Row>
              <Col xs={12}>
                <CallToAction />
              </Col>
            </Row>
          </Container>
        </div>
      </Layout>
    </>
  );
}

export default OrderTracking;
