import Link from "next/link";
import textData from "@/data/callToAction.json";

const CallToAction = () => {
  return (
    <>
      <div className="call-to-action-inner call-to-action-inner-6 ltn__secondary-bg position-relative">
        <div className="coll-to-info text-color-white">
          <h1>{textData.heading}</h1>
          <p>
            {textData.paragraph} <span>{textData.spanText}</span>
          </p>
        </div>
        <div className="btn-wrapper">
          <Link className="btn btn-effect-3 btn-white" href="/">
            {textData.buttonText} <i className="icon-next"></i>
          </Link>
        </div>
      </div>
    </>
  );
};

export default CallToAction;
