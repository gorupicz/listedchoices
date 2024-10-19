import superjson from 'superjson';
import { Prisma } from '@prisma/client';

// Helper function to recursively handle nested fields
const serializeField = (value) => {
  if (Prisma.Decimal.isDecimal(value)) {
    return value.toNumber();
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (Array.isArray(value)) {
    return value.map(serializeField);
  }
  if (value && typeof value === 'object') {
    return serializePrismaData(value); // Recursively serialize nested objects
  }
  return value;
};

// Helper function to serialize Prisma data
export const serializePrismaData = (data) => {
  if (!data || typeof data !== 'object') {
    return data; // Return primitive types as is
  }

  const serializedData = {};

  Object.keys(data).forEach((key) => {
    serializedData[key] = serializeField(data[key]);
  });

  return serializedData;
};

// Helper function for MongoDB data serialization
export const serializeMongoData = (data) => {
  if (!data || typeof data !== 'object') {
    return data; // Return primitive types as is
  }

  const serializedData = {};

  Object.keys(data).forEach((key) => {
    const value = data[key];

    // Handle MongoDB ObjectID types by converting them to strings
    if (key === '_id' && value && typeof value === 'object' && value.toString) {
      serializedData[key] = value.toString();
    } else if (value && typeof value === 'object' && value._bsontype === 'ObjectID') {
      serializedData[key] = value.toString();
    } else if (value instanceof Date) {
      serializedData[key] = value.toISOString();
    } else if (Array.isArray(value)) {
      serializedData[key] = value.map(serializeField);
    } else {
      serializedData[key] = serializeField(value); // Recursively serialize nested objects
    }
  });

  return serializedData;
};
