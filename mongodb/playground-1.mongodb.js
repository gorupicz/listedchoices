/* global use, db */
// MongoDB Playground
// To disable this template go to Settings | MongoDB | Use Default Template For Playground.
// Make sure you are connected to enable completions and to be able to run a playground.
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.
// The result of the last command run in a playground is shown on the results panel.
// By default the first 20 documents will be returned with a cursor.
// Use 'console.log()' to print to the debug output.
// For more documentation on playgrounds please refer to
// https://www.mongodb.com/docs/mongodb-vscode/playgrounds/

// Select the database to use.
use('bolsadecasas');

// Update the document with the specified _id

// Find the document with the specified _id
const originalDocument = db.getCollection('listings').findOne(
    { _id: ObjectId("673f6568cf409cc71082b57a") }
);

// Remove the _id field from the original document to avoid duplicate key error
delete originalDocument._id;

// Insert the document as a new entry
db.getCollection('listings').insertOne(originalDocument);

const allListings = db.getCollection('listings').find({}).toArray();

// Print the results to the console.
console.log(allListings);
