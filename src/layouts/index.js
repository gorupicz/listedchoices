import { Fragment, useState } from "react";
import { Header } from "@/components/header";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll-to-top";
import BreadCrumb from "@/components/breadCrumbs";

const Layout = ({ children, navPositionClass, topbar, breadcrumb, breadcrumbProps }) => {
  const [toggleClassName, SetToggleClassName] = useState(false);

  function toggleClassNameInBody() {
    SetToggleClassName((toggleClassName) => !toggleClassName);
  }

  return (
    <Fragment>
      <div
        className={`body-wrapper ${toggleClassName ? "ltn__utilize-open" : ""}`}
      >
        <Header
          toggleClassNameInBody={toggleClassNameInBody}
          SetToggleClassName={SetToggleClassName}
          navPositionClass={navPositionClass}
          topbar={topbar}
        />
        {breadcrumb && <BreadCrumb {...breadcrumbProps} />}
        {children}
        <Footer />
        <ScrollToTop />
      </div>
    </Fragment>
  );
};

export { Layout };
