const TitleSection = ({ titleSectionData, headingClasses }) => {
  return (
    <>
      <div className={`section-title-area text-center`}>
        <h4
          className={`section-subtitle ${headingClasses} ltn__secondary-color`}
        >
          {titleSectionData.subTitle}
        </h4>
        <h1 className="section-title"> {titleSectionData.title}</h1>
      </div>
    </>
  );
};

export default TitleSection;
