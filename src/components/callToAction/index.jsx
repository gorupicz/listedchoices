import Link from "next/link";
import Image from "next/image";

const CallToAction = () => {
  return (
    <>
      <div className="call-to-action-inner call-to-action-inner-6 ltn__secondary-bg position-relative">
        <div className="coll-to-info text-color-white">
          <h1>Looking to invest in Vacation Rental?</h1>
          <p>Earn passive income by investing in <span>Choices</span></p>
        </div>
        <div className="btn-wrapper">
          <Link className="btn btn-effect-3 btn-white" href="/">
            Explore Choices <i className="icon-next"></i>
          </Link>
        </div>
      </div>
    </>
  );
};

export default CallToAction;
