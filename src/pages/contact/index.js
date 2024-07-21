import { Layout } from "@/layouts";
import { Container, Row, Col } from "react-bootstrap";
import ShopBreadCrumb from "@/components/breadCrumbs/shop";
import CallToAction from "@/components/callToAction";
import Contact from "@/components/contact";

function ContactUs() {
  return (
    <>
      <Layout topbar={true}>
        <ShopBreadCrumb
          title="Contact Us"
          sectionPace=""
          currentSlug="Contact"
        />

        <Contact />

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

export default ContactUs;
