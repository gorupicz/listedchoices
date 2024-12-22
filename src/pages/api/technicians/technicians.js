import { PrismaClient } from "@prisma/client";
import connectMongoDB from "/mongodb/mongoClient";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { page = 1, city, speciality } = req.query;
  const limit = 12;
  const offset = (page - 1) * limit;

  try {
    // Fetch all data from MySQL without filters
    const technicianDataMYSQL = await prisma.technician.findMany({
      where: {
        status: 'active',
      },
      orderBy: [
      {
        featured: 'desc'
      },
      {
        downvotes: 'asc'
      },
      {
        upvotes: 'desc'
      },
      {
        name: 'asc'
      }
    ],
    });

    console.log("Fetched MySQL Data:", technicianDataMYSQL);


    const serializedtechnicianDataMYSQL = technicianDataMYSQL.map(technicianDataMYSQL => ({
      ...technicianDataMYSQL,
      createdAt: technicianDataMYSQL.createdAt.toISOString(),
      updatedAt: technicianDataMYSQL.updatedAt.toISOString(),
      phoneNumber: technicianDataMYSQL.phoneNumber.toString(),
      upvotes: technicianDataMYSQL.upvotes ?? 0,
      downvotes: technicianDataMYSQL.downvotes ?? 0,
    }));

    // Fetch filter data from MongoDB with filters
    const db = await connectMongoDB();
    const technicians = await db.collection('technicians').find({
      ...(city && { cities: city }),
      ...(speciality && { specialities: speciality }),
    }).toArray();

    // Combine data from MySQL and MongoDB
    const combinedData = serializedtechnicianDataMYSQL.map(mysqlTech => {
      const mongoTech = technicians.find(mongoTech => mongoTech.id === mysqlTech.id);
      return mongoTech ? {
        ...mysqlTech,
        ...mongoTech,
        _id: mongoTech._id.toString(),
      } : null;
    }).filter(item => item !== null);

    // Apply pagination after sorting
    const paginatedData = combinedData.slice(offset, offset + limit);

    res.status(200).json(paginatedData);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
} 