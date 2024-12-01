import { Fragment, useEffect } from "react";
import Head from "next/head";
import { Nunito_Sans, Poppins } from "next/font/google";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { wrapper } from "@/store";
import { setProducts } from "@/store/slices/product-slice";
import products from "@/data/products.json";
import Preloader from "@/components/preloader";
import "animate.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "bootstrap/dist/css/bootstrap.min.css";
import 'node_modules/react-modal-video/scss/modal-video.scss';
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/counter.css";
import "@/assets/sass/style.scss";
import "@/assets/responsive.css";
import { SessionProvider } from 'next-auth/react';
import CookieConsent from "react-cookie-consent";
import { OGMetadataProvider, useOGMetadata } from "@/context/OGMetadataContext";
import metadata from "@/data/metadata.json";
import { appWithTranslation } from 'next-i18next';
import '../lib/i18n'; // Import your i18n configuration
import { GoogleTagManager } from '@next/third-parties/google'; // Import GTM

const nunito = Nunito_Sans({
  weight: ["200", "300", "400", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});
const Poppin = Poppins({
  weight: ["200", "300", "400", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

const MyApp = ({ Component, ...rest }) => {
  const { store, props } = wrapper.useWrappedStore(rest);

  useEffect(() => {
    store.dispatch(setProducts(products));
  }, []);
  
  return (
    <OGMetadataProvider>
      <OGMetadataConsumerComponent Component={Component} props={props} store={store} />
    </OGMetadataProvider>
  );
};

const OGMetadataConsumerComponent = ({ Component, props, store }) => {
  const { isOGMetadataSet } = useOGMetadata();

  return (
    <Fragment>
      <Head>
        {!isOGMetadataSet && (
          <>
            <title>{metadata.title}</title>
            <meta name="description" content={metadata.description} />
            <meta name="viewport" content={metadata.viewport} />
            <link rel="icon" href={metadata.icon} />
            <meta property="og:title" content={metadata.ogTitle} />
            <meta property="og:url" content={metadata.ogUrl} />
            <meta property="og:description" content={metadata.ogDescription} />
            <meta property="og:image" content={metadata.ogImage} />
          </>
        )}
      </Head>
      <GoogleTagManager gtmId="GTM-5F6TSG9X" />
      <style jsx global>{`
        html,body {
          font-family: ${nunito.style.fontFamily};
        }

        h1, h2, h3, h4, h5, h6, .h1, .h2, .h3, .h4, .h5, .h6 {
          font-family: ${Poppin.style.fontFamily};
        }
      `}</style>
      <SessionProvider session={props.pageProps.session}>
        <Provider store={store}>
          <PersistGate persistor={store.__persistor} loading={<Preloader />}>
            <Component {...props.pageProps} />
          </PersistGate>
        </Provider>
        <CookieConsent
          location="bottom"
          buttonText="Accept"
          declineButtonText="Decline"
          enableDeclineButton
          cookieName="mySiteCookieConsent"
          style={{ background: "#2B373B", color: "#ffffff" }}
          buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
          expires={365}
        >
          This website uses cookies to enhance the user experience.{" "}
          <a href="/blog/privacy-policy" style={{ color: "#ffffff", textDecoration: "underline" }}>
            Learn more
          </a>
        </CookieConsent>
      </SessionProvider>
    </Fragment>
  );
};

export default MyApp;
