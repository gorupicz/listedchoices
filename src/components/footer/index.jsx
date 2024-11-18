import Link from "next/link";
import Image from "next/image";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedin,
  FaYoutube,
  FaPaperPlane,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFlagUsa,
  FaFlag,
} from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import LanguageModal from '../modals/LanguageModal'; // Adjust the path as necessary
import { Button } from 'react-bootstrap';

const Footer = function () {
  const { t, i18n } = useTranslation('footer');
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const toggleLanguageModal = () => setShowLanguageModal(!showLanguageModal);

  return (
    <>
      {/* <!-- FOOTER AREA START --> */}
      <footer className="ltn__footer-area  ">
        <div className="footer-top-area  section-bg-2 plr--5">
          <Container fluid>
            <Row>
              <Col xs={12} sm={6} xl={3}>
                <div className="footer-widget footer-about-widget">
                  <div className="footer-logo">
                    <div className="site-logo">
                      <Image
                        src="/img/isologo.png"
                        alt="Listed Choices logo"
                        width={43}
                        height={43}
                      />
                    </div>
                  </div>
                  <p>{t('about')}</p>
                  <div className="footer-address">
                    <ul>
                      <li>
                        <div className="footer-address-icon">
                          <FaMapMarkerAlt />
                        </div>
                        <div className="footer-address-info">
                          <p>{t('address')}</p>
                        </div>
                      </li>
                      <li>
                        <div className="footer-address-icon">
                          <FaEnvelope />
                        </div>
                        <div className="footer-address-info">
                          <p>
                            <Link href={`mailto:${t('email')}`}>
                              {t('email')}
                            </Link>
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="ltn__social-media mt-20">
                    <ul>
                      <li>
                        <Link href="https://www.facebook.com/profile.php?id=61557227398934" target="_blank" title="Facebook">
                          <FaFacebookF />
                        </Link>
                      </li>
                      <li>
                        <Link href="#" title="Twitter">
                          <FaTwitter />
                        </Link>
                      </li>
                      <li>
                        <Link href="https://www.linkedin.com/company/bolsadecasas/" title="Linkedin">
                          <FaLinkedin />
                        </Link>
                      </li>
                      <li>
                        <Link href="#" title="Youtube">
                          <FaYoutube />
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="btn-wrapper mt-20">
                    <Button 
                      onClick={toggleLanguageModal} 
                      variant="secondary" 
                      className="language-btn social-btn"
                    >
                      <span className="icon">{i18n.language === 'es' ? '🇲🇽' : '🇺🇸'}</span> {i18n.language === 'es' ? 'Español' : 'English'}
                    </Button>
                  </div>
                  <LanguageModal show={showLanguageModal} handleClose={toggleLanguageModal} />
                  <div className="btn-wrapper mt-0">
                    <Button
                      onClick={toggleLanguageModal}
                      variant="secondary"
                      className="language-btn social-btn"
                    >
                      <span className="icon">{i18n.language === 'es' ? '$' : '$'}</span> {i18n.language === 'es' ? 'Español' : 'English'}
                    </Button>
                  </div>
                  <LanguageModal show={showLanguageModal} handleClose={toggleLanguageModal} />
                </div>
              </Col>
              <Col xs={12} sm={6} xl={2}>
                <div className="footer-widget footer-menu-widget clearfix">
                  <h4 className="footer-title">{t('company')}</h4>
                  <div className="footer-menu">
                    <ul>
                      {t('companyLinks', { returnObjects: true }).map((link, index) => (
                        <li key={index}>
                          <Link href={`/${link.toLowerCase().replace(/ /g, '-')}`}>{link}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Col>
              <Col xs={12} sm={6} xl={2}>
                <div className="footer-widget footer-menu-widget clearfix">
                  <h4 className="footer-title">{t('services')}</h4>
                  <div className="footer-menu">
                    <ul>
                      {t('servicesLinks', { returnObjects: true }).map((link, index) => (
                        <li key={index}>
                          <Link href={`/${link.toLowerCase().replace(/ /g, '-')}`}>{link}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Col>
              <Col xs={12} sm={6} xl={2}>
                <div className="footer-widget footer-menu-widget clearfix">
                  <h4 className="footer-title">{t('customerCare')}</h4>
                  <div className="footer-menu">
                    <ul>
                      {t('customerCareLinks', { returnObjects: true }).map((link, index) => (
                        <li key={index}>
                          <Link href={`/${link.toLowerCase().replace(/ /g, '-')}`}>{link}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Col>
              <Col xs={12} sm={6} xl={3}>
                <div className="footer-widget footer-newsletter-widget">
                  <h4 className="footer-title">{t('newsletter')}</h4>
                  <p>{t('newsletterDescription')}</p>
                  <div className="footer-newsletter">
                    <form action="#">
                      <input type="email" name="email" placeholder={t('newsletterPlaceholder')} />
                      <div className="btn-wrapper">
                        <button className="theme-btn-1 btn email-btn" type="submit">
                          {" "}
                          <FaPaperPlane />
                        </button>
                      </div>
                    </form>
                  </div>
                  <h5 className="mt-30">{t('weAccept')}</h5>
                  <img src="/img/icons/payment-4.png" alt="Payment Image" />
                </div>
              </Col>
            </Row>
          </Container>
        </div>
        <div className="ltn__copyright-area ltn__copyright-2 section-bg-7  plr--5">
          <div className="container-fluid ltn__border-top-2">
            <Row>
              <Col xs={12} md={6}>
                <div className="ltn__copyright-design clearfix">
                  <p>
                    {t('allRightsReserved')}{" "}
                    <span className="current-year"></span>
                  </p>
                </div>
              </Col>
              <Col xs={12} md={6} className="align-self-center">
                <div className="ltn__copyright-menu text-end">
                  <ul>
                    <li>
                      <Link href="/blog/terms-of-service">{t('termsOfService')}</Link>
                    </li>
                    <li>
                      <Link href="/blog/privacy-policy">{t('privacyPolicy')}</Link>
                    </li>
                  </ul>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </footer>
      {/* <!-- FOOTER AREA END --> */}
    </>
  );
};

export default Footer;
