import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Col, Container, Row } from "react-bootstrap";
import { PrismaClient } from "@prisma/client";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import CallToAction from "@/components/callToAction";
import { productSlug } from "@/lib/product";
import Lightbox from "yet-another-react-lightbox";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Download from "yet-another-react-lightbox/plugins/download";
import { Layout } from "@/layouts";
import connectMongoDB from "/mongodb/mongoClient";
import { createAvatar } from '@dicebear/avatars';
import * as personasStyle from '@dicebear/personas';
import { parsePhoneNumber } from 'libphonenumber-js';
import TechnicianCard from "@/components/TechnicianCard";
const prisma = new PrismaClient();

export async function getServerSideProps() {
  // Fetch initial data from MySQL
  const technicianDataMYSQL = await prisma.technician.findMany({
    orderBy: {
      featured: 'desc',
    },
    take: 12,
  });

  // Convert Date objects to strings
  const serializedtechnicianDataMYSQL = technicianDataMYSQL.map(technicianDataMYSQL => ({
    ...technicianDataMYSQL,
    createdAt: technicianDataMYSQL.createdAt.toISOString(),
    updatedAt: technicianDataMYSQL.updatedAt.toISOString(),
    phoneNumber: technicianDataMYSQL.phoneNumber.toString(),
    upvotes: technicianDataMYSQL.upvotes ?? 0,
    downvotes: technicianDataMYSQL.downvotes ?? 0,
  }));
  // Fetch filter data from MongoDB
  const db = await connectMongoDB();
  const technicians = await db.collection('technicians').find().toArray();
  const cities = [...new Set(technicians.flatMap(tech => tech.cities))].filter(Boolean);
  const specialities = [...new Set(technicians.flatMap(tech => tech.specialities))].filter(Boolean);
  // Combine data from MySQL and MongoDB
  const technicianData = serializedtechnicianDataMYSQL.map(mysqlTech => {
    const mongoTech = technicians.find(mongoTech => mongoTech.id === mysqlTech.id);
    return {
      ...mysqlTech,
      ...mongoTech,
      _id: mongoTech._id.toString(),
    };
  });

  return {
    props: {
      initialTechnicianData: technicianData,
      cities,
      specialities,
    },
  };
}

function PortFolioPageTwo({ initialTechnicianData = [], cities = [], specialities = [] }) {
  const [data, setData] = useState(initialTechnicianData);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cityFilter, setCityFilter] = useState(null);
  const [specialityFilter, setSpecialityFilter] = useState(null);

  const loadMoreData = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/technicians?page=${page + 1}&city=${cityFilter || ''}&speciality=${specialityFilter || ''}`);
      const newData = await res.json();

      if (newData.length > 0) {
        setData((prevData) => [...prevData, ...newData]);
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error("Failed to load more data:", error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, cityFilter, specialityFilter]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading) return;
      loadMoreData();
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMoreData, loading]);

  const filterData = async (city = null, speciality = null) => {
    setCityFilter(city);
    setSpecialityFilter(speciality);
    setPage(1); // Reset page to 1

    try {
      const res = await fetch(`/api/technicians?page=1&city=${city || ''}&speciality=${speciality || ''}`);
      const filteredData = await res.json();

      if (filteredData.length > 0) {
        setData(filteredData);
      }
    } catch (error) {
      console.error("Failed to filter data:", error);
    }
  };

  const handleCityFilter = (city) => {
    filterData(city, specialityFilter);
  };

  const handleSpecialityFilter = (speciality) => {
    filterData(cityFilter, speciality);
  };

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

  const [basicExampleOpen, setBasicExampleOpen] = useState(false);
  const gallerySlides = data.map((img, i) => ({
    src: img.thumbImage || `data:image/svg+xml;utf8,${encodeURIComponent(createAvatar(personasStyle, { seed: img.name || 'default' }))}`,
    key: i,
  }));

  return (
    <>
      <Lightbox
        open={basicExampleOpen}
        close={() => setBasicExampleOpen(false)}
        slides={gallerySlides}
        plugins={[Zoom, Counter, Fullscreen, Download]}
      />

      <Layout 
        topbar={false}
      >
        <div className="ltn__gallery-area mb-120">
          <Container>
            <Row>
              <Col xs={12}>
                <div className="ltn__gallery-menu mt-50">
                  <div className="ltn__gallery-filter-menu portfolio-filter text-uppercase mb-0">
                    <button
                      onClick={() => handleCityFilter(null)}
                      className={cityFilter === null ? "active" : ""}
                    >
                      All Cities
                    </button>
                    {cities.map((city, key) => (
                      <button
                        key={key}
                        onClick={() => handleCityFilter(city)}
                        className={cityFilter === city ? "active" : ""}
                      >
                        {city}
                      </button>
                    ))}
                  </div>

                  <div className="ltn__gallery-filter-menu portfolio-filter text-uppercase mb-20">
                    <button
                      onClick={() => handleSpecialityFilter(null)}
                      className={specialityFilter === null ? "active" : ""}
                    >
                      All Services
                    </button>
                    {specialities.map((speciality, key) => (
                      <button
                        key={key}
                        onClick={() => handleSpecialityFilter(speciality)}
                        className={specialityFilter === speciality ? "active" : ""}
                      >
                        {speciality}
                      </button>
                    ))}
                  </div>
                </div>
              </Col>
            </Row>

            <Row className="ltn__gallery-active ltn__gallery-style-1">
              <AnimatePresence>
                {data.map((item) => {
                  return (
                    <motion.div
                      key={item.id}
                      className="ltn__gallery-item col-md-3 col-sm-6 col-12"
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <TechnicianCard
                        key={item.id}
                        item={item}
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </Row>
          </Container>
        </div>
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

export default PortFolioPageTwo;
