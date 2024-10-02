import superjson from 'superjson';
import { Prisma } from '@prisma/client';

// Helper function to serialize Prisma data
export const serializePrismaData = (data) => {
  const { json: superjsonData } = superjson.serialize(data);

  Object.keys(superjsonData).forEach((key) => {
    const value = superjsonData[key];

    // Handle Prisma Decimal types by converting them to numbers
    if (Prisma.Decimal.isDecimal(value)) {
      superjsonData[key] = value.toNumber();
    }

    // Handle Date objects by converting them to ISO strings
    if (value instanceof Date) {
      superjsonData[key] = value.toISOString();
    }
  });

  return superjsonData;
};

// Helper function for MongoDB data serialization
export const serializeMongoData = (data) => {
  const { json: superjsonData } = superjson.serialize(data);

  Object.keys(superjsonData).forEach((key) => {
    const value = superjsonData[key];

    // Handle MongoDB ObjectID types by converting them to strings
    if (key === '_id' && value && typeof value === 'object' && value.toString) {
      superjsonData[key] = value.toString();
    }

    // Convert nested ObjectId fields if they exist
    if (value && typeof value === 'object' && value._bsontype === 'ObjectID') {
      superjsonData[key] = value.toString();
    }

    // Handle Date objects by converting them to ISO strings
    if (value instanceof Date) {
      superjsonData[key] = value.toISOString();
    }
  });

  return superjsonData;
};