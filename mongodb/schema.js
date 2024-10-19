db.createCollection("listings", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [ "property_id" ],
      properties: {
        property_id: { bsonType: "int" },
        title: { bsonType: "string" },
        shortDescription: { bsonType: "string" },
        fullDescription: { bsonType: "string" },
        photos: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: [ "url" ],
            properties: {
              url: { bsonType: "string" },
              description: { bsonType: "string" },
              main: { bsonType: "boolean" },
            }
          }
        },
        video: { bsonType: "string" },
        amenities: { bsonType: "array", items: { bsonType: "string" } },
        featured: { bsonType: "boolean" },
        income: {
          bsonType: "object",
          required: [ "currency", "amount", "period" ],
          properties: {
            currency: { bsonType: "string" },
            amount: { bsonType: "decimal" },
            period: ["last twelve months", "year to date", "maximun", "last month", "last three months", "current month", "last year"]
          }
        },
        expenses: {
          bsonType: "object",
          required: [ "currency", "amount", "period" ],
          properties: {
            currency: { bsonType: "string" },
            amount: { bsonType: "decimal" },
            period: ["last twelve months", "year to date", "maximun", "last month", "last three months", "current month", "last year"]
          }
        },
        occupancy: {
          bsonType: "object",
          required: [ "currency", "amount", "period" ],
          properties: {
            value: { bsonType: "decimal" },
            period: ["last twelve months", "year to date", "maximun", "last month", "last three months", "current month", "last year"]
          }
        },
        tags: { bsonType: "array", items: { bsonType: "string" } },
        businessFacts: {
          bsonType: "object",
          properties: {
            rentals: { bsonType: "int" },
            reviews:  { bsonType: "int" },
            score:  { bsonType: "decimal" },
          }
        },
        propertyFacts: {
          bsonType: "object",
          properties: {
            bedrooms: { bsonType: "int" },
            bathrooms: { bsonType: "int" },
            square_footage: { bsonType: "int" },
            lot_size: { bsonType: "int" },
            year_built: { bsonType: "int" }
          }
        },
        location: {
          bsonType: "object",
          required: [ "address", "city", "state", "country" ],
          properties: {
            address: { bsonType: "string" },
            city: { bsonType: "string" },
            state: { bsonType: "string" },
            country: { bsonType: "string" },
            coordinates: {
              bsonType: "object",
              properties: {
                lat: { bsonType: "double" },
                lng: { bsonType: "double" }
              }
            }
          }
        },
        measures: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              name: { bsonType: "string" },
              value: { bsonType: "string" }
            }
          }
        },
        created_at: { bsonType: "date" },
        updated_at: { bsonType: "date" }
      }
    }
  }
});
