import { Fragment, useEffect } from "react";
import Head from "next/head";
import { Nunito_Sans,Poppins } from "next/font/google";
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
    <Fragment>
      <Head>
        <title>Bolsa de Casas</title>
        <meta name="description" content="Bolsa de Casas - Mercado de Propiedades de Renta Vacacional" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Bolsa de Casas" />
        <meta property="og:url" content="https://www.listedchoices.com" />
        <meta property="og:description" content="Bolsa de Casas - Mercado de Propiedades de Renta Vacacional" />
        <meta property="og:image" content="https://www.listedchoices.com/img/product-3/boat-vison-fund.jpg" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
      </SessionProvider>
    </Fragment>
  );
};

export default MyApp;
