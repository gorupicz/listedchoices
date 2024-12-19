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
import TechnicianCard from "@/components/TechnicianCard";
import { getDistance } from 'geolib';
import axios from 'axios';

const prisma = new PrismaClient();

export async function getServerSideProps(context) {
  // Capture the client's IP address from the request headers
  const clientIp = context.req.headers['x-forwarded-for'] || context.req.connection.remoteAddress;

  // Fetch initial data from MySQL
  const technicianDataMYSQL = await prisma.technician.findMany({
    where: {
      status: 'active',
    },
    orderBy: [
      {
        featured: 'desc'
      },
      {
        name: 'asc'
      }
    ],
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

  // Get user's coordinates from IP
  const userCityCoordinates = await getUserCoordinatesFromIP(clientIp);

  console.log("User Coordinates:", userCityCoordinates);

  if (!userCityCoordinates) {
    console.error("Could not determine user's coordinates from IP.");
    return {
      props: {
        initialTechnicianData: [],
        cities: [],
        specialities: [],
      },
    };
  }

  // Calculate distances and sort cities
  const citiesWithDistance = await Promise.all(
    [...new Set(technicians.flatMap(tech => tech.cities))]
      .filter(Boolean)
      .map(async (city) => {
        const cityCoordinates = await getCityCoordinates(city);
        if (!cityCoordinates) {
          console.error(`Could not get coordinates for city: ${city}`);
          return null;
        }
        const distance = getDistance(userCityCoordinates, cityCoordinates);
        console.log(`City: ${city}, Coordinates: ${cityCoordinates}, Distance: ${distance}`);
        return { city, distance };
      })
  );

  // Filter out any null values
  const sortedCities = citiesWithDistance
    .filter(item => item !== null)
    .sort((a, b) => a.distance - b.distance)
    .map(item => item.city);

  console.log("Sorted Cities by Distance:", sortedCities);

  const specialities = [...new Set(technicians.flatMap(tech => tech.specialities))].filter(Boolean).sort();
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
      cities: sortedCities,
      specialities,
    },
  };
}

async function getCityCoordinates(city) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city)}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    const data = response.data;
    console.log(`Google Maps Response for ${city}:`, data);

    if (data.results && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry.location;
      return { latitude: lat, longitude: lng };
    } else {
      console.error(`No results found for city: ${city}`);
      return { latitude: 0, longitude: 0 }; // Default coordinates
    }
  } catch (error) {
    console.error(`Error fetching coordinates for city: ${city}`, error);
    return { latitude: 0, longitude: 0 }; // Default coordinates
  }
}

async function getUserCoordinatesFromIP(clientIp) {
  const token = process.env.IPINFO_TOKEN;
  const url = `https://ipinfo.io/${clientIp}?token=${token}`;

  try {
    const response = await axios.get(url);
    const data = response.data;
    console.log("IPInfo Response:", data);
    const [latitude, longitude] = data.loc.split(',').map(Number);
    return { latitude, longitude };
  } catch (error) {
    console.error("Error fetching user's coordinates from IP:", error);
    return { latitude: 0, longitude: 0 };
  }
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

      // Directly set the filtered data
      setData(filteredData);
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
