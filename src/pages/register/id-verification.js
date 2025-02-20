import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { Layout } from "@/layouts";
import { Row, Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Link from "next/link";
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import ErrorSuccessModal from "@/components/modals/ErrorSuccessModal";
import { getSession } from "next-auth/react";
import React, { useCallback } from "react";
import Webcam from "react-webcam";
import { FaTrash } from "react-icons/fa";
import Cookies from 'js-cookie';
import prisma from '@/lib/prisma'; // Import your Prisma client
export async function getServerSideProps(context) {
  const { locale } = context;
  i18next.changeLanguage(locale); // Set the language explicitly based on the route locale

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

function IdVerification({ user }) {
const router = useRouter();

  if (!user || user.idIsVerified) {
    const redirectPath = !user ? '/register' : '/accreditation';
    if (!user) {
      Cookies.set('redirectAfterAuthenticated', window.location.pathname, { expires: 1, path: '/' });
    }
    router.push(redirectPath);
    return;
  }


  const { t } = useTranslation('register/id-verification'); 
  const [modalMessage, setModalMessage] = useState('');
  const [title, setTitle] = useState('');
  const [submitText, setSubmitText] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isError, setIsError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [photo, setPhoto] = useState(null);
  const webcamRef = React.useRef(null);

  // Determine video constraints based on initial window size
  const initialVideoConstraints = window.innerWidth <= 768 ? 
    { width: 320, height: 480, facingMode: "user" } : 
    { width: 320, height: 480, facingMode: "user" };

  const [videoConstraints, setVideoConstraints] = useState(initialVideoConstraints);

  // Modal functions to show and close modal
  const handleShowModal = (title, message, submitText, isError, isVerified) => {
    setTitle(title);
    setModalMessage(message);
    setSubmitText(submitText);
    setIsError(isError);
    setShowModal(true);
    setIsVerified(isVerified);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    if (!isError) {
      router.push('/accreditation');
    }
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setPhoto(imageSrc);
  }, [webcamRef]);

  const handleRetake = () => {
    setPhoto(null); // Reset the photo to retake
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!photo) {
      handleShowModal(t('errorModalTitle'), t('photoRequiredMessage'), t('modalSubmitText'), true, false);
      return;
    }

    // Convert base64 to Blob
    const byteString = atob(photo.split(',')[1]);
    const mimeString = photo.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });

    const formData = new FormData();
    formData.append('photo', blob, 'photo.jpg');
    formData.append('userId', user.id);

    try {
      const res = await fetch('/api/upload-photo', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();

      if (res.ok && result.idVerificationInProgress) {
        handleShowModal(t('successModalTitle'), t('successMessage'), t('modalSubmitText'), false, true);
      } else {
        console.error('Error:', result.error);
        handleShowModal(t('errorModalTitle'), t('errorMessage'), t('modalSubmitText'), true, false);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      handleShowModal(t('errorModalTitle'), t('errorMessage'), t('modalSubmitText'), true, false);
    }
  };

  return (
    <>
      <Layout topbar={false}>
        <div className="ltn__login-area pb-65 pt-20">
          <div className="container">
            <Row>
              <Col xs={12}>
                <div className="section-title-area text-center mb-10">
                  <h1 className="section-title mb-10">{t('pageTitle')}</h1>
                  <p>{t('pageDescription')}</p>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12} lg={{ span: 4, offset: 4 }}>
                <div className="account-login-inner ltn__form-box contact-form-box">
                  <form onSubmit={handleSubmit}>
                    <div className="webcam-container">
                      {photo ? (
                        <img src={photo} alt="Captured" width="100%" className="mb-10"/>
                      ) : (
                        <Webcam
                          audio={false}
                          mirrored={true}
                          ref={webcamRef}
                          screenshotFormat="image/jpeg"
                          videoConstraints={videoConstraints}
                          width="100%"
                        />
                      )}
                      <button
                        type="button"
                        onClick={photo ? handleRetake : capture}
                        className="camera-btn"
                      >
                        {photo ? <FaTrash /> : ''}
                      </button>
                    </div>
                    <div className="btn-wrapper mt-10 text-center">
                      <button className="email-btn social-btn btn" type="submit">
                        {t('submitButtonText')}
                      </button>
                    </div>
                  </form>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </Layout>

      <ErrorSuccessModal
        show={showModal}
        handleClose={handleCloseModal}
        content={{
          title: title,
          submitText: submitText,
          message: modalMessage
        }}
      />
    </>
  );
}

export default IdVerification;