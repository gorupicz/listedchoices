import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import { Layout } from "@/layouts";
import CallToAction from "@/components/callToAction";
import TitleSection from "@/components/titleSection";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import { getSession } from "next-auth/react";
import prisma from '@/lib/prisma'; // Import your Prisma client
import AccreditationTab from "@/components/accreditationTab/";
import Cookies from 'js-cookie';

export async function getServerSideProps(context) {
    const session = await getSession(context);

    if (session) {
        // Query the database for the latest user information
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                email: true,
                isVerified: true,
                phoneIsVerified: true,
                idIsVerified: true,
                idPhotograph: true,
                // Add any other fields you need
            },
        });

        return {
            props: { user },
        };
    }
    return {
        props: { user: null },
    };
}

function AccreditationPage({ user }) {
    const { t } = useTranslation('accreditation');
    const slides = t('slides', { returnObjects: true });

    let defaultActiveKey = 'first';
    if (user) {
        Cookies.remove('redirectAfterAuthenticated');
        slides[0].isInactive = true;
        const userEmailIsVerified = user.isVerified || false;
        const userPhoneIsVerified = user.phoneIsVerified === true || false;
        const userIdIsVerified = user.idIsVerified === true || false;
        const idVerificationInProgress = (!userIdIsVerified && user.idPhotograph !== null) || false;
        
        if (userIdIsVerified) {
            console.log('User ID is verified');
            defaultActiveKey = 'fourth';
            slides[2].isInactive = true;
            if (userPhoneIsVerified) slides[1].isInactive = true;
        } else if (userPhoneIsVerified) {
            console.log('User phone is verified');
            defaultActiveKey = 'third';
            slides[1].isInactive = true;
            if (idVerificationInProgress) {
                slides[2].isInactive = true;
                slides[2].inactiveButtonText = slides[2].verificationInProgressButtonText;
            }
        } else if (userEmailIsVerified) {
            console.log('User email is verified');
            defaultActiveKey = 'second';
        }
    } else {
        Cookies.set('redirectAfterAuthenticated', window.location.pathname, { expires: 1, path: '/' });
    }


    const SlickArrowLeft = ({ currentSlide, slideCount, ...props }) => (
        <button
            {...props}
            className={
                "slick-prev slick-arrow" + (currentSlide === 0 ? " slick-disabled" : "")
            }
            aria-hidden="true"
            aria-disabled={currentSlide === 0 ? true : false}
            type="button"
        >
            <FaArrowLeft />
        </button>
    );
    const SlickArrowRight = ({ currentSlide, slideCount, ...props }) => (
        <button
            {...props}
            className={
                "slick-next slick-arrow" +
                (currentSlide === slideCount - 1 ? " slick-disabled" : "")
            }
            aria-hidden="true"
            aria-disabled={currentSlide === slideCount - 1 ? true : false}
            type="button"
        >
            <FaArrowRight />
        </button>
    );

    return (
        <Layout topbar={false}>
            <div className="ltn__our-history-area pb-100">
                <Container>
                    <Row>
                        <Col xs={12}>
                            <AccreditationTab 
                                slides={slides} 
                                defaultActiveKey={defaultActiveKey} 
                                user={user}
                            />
                        </Col>
                    </Row>
                </Container>
            </div>

            {/*
            <div className="ltn__feature-area section-bg-2 pt-115 pb-90">
                <Container>
                    <Row>
                        <Col xs={12}>
                            <TitleSection
                                headingClasses="section-subtitle-2"
                                titleSectionData={{
                                    subTitle: "Features",
                                    title: "Why Choose Us",
                                }}
                            />
                        </Col>
                    </Row>
                    <Row className="justify-content-center">
                        <Col xs={12} sm={6} xl={4}>
                            <div className="ltn__feature-item ltn__feature-item-7 ltn__feature-item-7-color-white">
                                <div className="ltn__feature-icon-title">
                                    <div className="ltn__feature-icon">
                                        <span><i className="flaticon-house-4"></i></span>
                                    </div>
                                    <h3 className="animated fadeIn"><Link href="https://quarter-nextjs.netlify.app/service/buy-a-home">The Perfect Residency</Link></h3>
                                </div>
                                <div className="ltn__feature-info">
                                    <p>Lorem ipsum dolor sit ame it, consectetur adipisicing elit, sed do eiusmod te mp or incididunt ut labore.</p>
                                </div>
                            </div>
                        </Col>
                        <Col xs={12} sm={6} xl={4}>
                            <div className="ltn__feature-item ltn__feature-item-7 ltn__feature-item-7-color-white">
                                <div className="ltn__feature-icon-title">
                                    <div className="ltn__feature-icon">
                                        <span><i className="icon-mechanic"></i></span>
                                    </div>
                                    <h3 className="animated fadeIn"><Link href="https://quarter-nextjs.netlify.app/service/buy-a-home">Global Architect Experts</Link></h3>
                                </div>
                                <div className="ltn__feature-info">
                                    <p>Lorem ipsum dolor sit ame it, consectetur adipisicing elit, sed do eiusmod te mp or incididunt ut labore.</p>
                                </div>
                            </div>
                        </Col>
                        <Col xs={12} sm={6} xl={4}>
                            <div className="ltn__feature-item ltn__feature-item-7 ltn__feature-item-7-color-white">
                                <div className="ltn__feature-icon-title">
                                    <div className="ltn__feature-icon">
                                        <span><i className="icon-repair-1"></i></span>
                                    </div>
                                    <h3 className="animated fadeIn"><Link href="https://quarter-nextjs.netlify.app/service/buy-a-home">Built-in Storage Cupboards</Link></h3>
                                </div>
                                <div className="ltn__feature-info">
                                    <p>Lorem ipsum dolor sit ame it, consectetur adipisicing elit, sed do eiusmod te mp or incididunt ut labore.</p>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
            */}

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
    );
}

export default AccreditationPage;