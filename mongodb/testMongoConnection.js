// Import the MongoDB connection function
const connectMongoDB = require('./mongoClient');

async function addTestDocument() {
    try {
        // Connect to the database
        const db = await connectMongoDB();

        // Get the collection (will create if it doesn't exist)
        const collection = db.collection('listings');

        // Create a test document
        const testDocument = {
            title: "Sample Property",
            description: "This is a sample property for testing MongoDB integration.",
            price: 200000,
            location: {
                city: "Mexico City",
                country: "Mexico"
            },
            images: [
                "https://example.com/image1.jpg",
                "https://example.com/image2.jpg"
            ],
            video_url: "https://example.com/sample-video.mp4"
        };

        // Insert the document into the collection
        const result = await collection.insertOne(testDocument);
        console.log('Document inserted with _id:', result.insertedId);

    } catch (err) {
        console.error('Error inserting document:', err);
    }
}

// Call the function to add the test document
addTestDocument();
