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
db.getCollection('listings').updateOne(
    { _id: ObjectId("673f6568cf409cc71082b57a") },
    {
        $unset: { "photos": "" }
    }
);

db.getCollection('listings').updateOne(
    { _id: ObjectId("673f6568cf409cc71082b57a") },
    {
        $set: {
            "photos": [
                { "img": "https://a0.muscache.com/im/pictures/miso/Hosting-47826981/original/0a233e66-77b4-42a8-b65d-163c91123f83.jpeg" },
                { "img": "https://a0.muscache.com/im/pictures/miso/Hosting-47826981/original/e03d6b36-80e7-4574-9455-c2516f248eb0.jpeg" },
                { "img": "https://a0.muscache.com/im/pictures/miso/Hosting-47826981/original/76eb6baf-fca9-4ff8-8d67-88b0ddb9f5cc.jpeg" },
                { "img": "https://a0.muscache.com/im/pictures/miso/Hosting-47826981/original/1ca24523-9427-409d-8664-259dd505e37c.jpeg" },
                { "img": "https://a0.muscache.com/im/pictures/miso/Hosting-47826981/original/02838c8f-2817-4b6c-b12d-dcfbb66675f5.jpeg" },
                { "img": "https://a0.muscache.com/im/pictures/miso/Hosting-47826981/original/9be7f08d-eb3c-4364-91e4-12c65928b857.jpeg" },
                { "img": "https://a0.muscache.com/im/pictures/miso/Hosting-47826981/original/db55f7bf-13b1-40d7-b250-13008fb10120.jpeg" },
                { "img": "https://a0.muscache.com/im/pictures/miso/Hosting-47826981/original/ff695b9a-3dbb-43ad-ab52-07d65349d9d5.jpeg" },
                { "img": "https://a0.muscache.com/im/pictures/miso/Hosting-47826981/original/2daeb073-0595-4c03-8243-2975c601e808.jpeg" },
                { "img": "https://a0.muscache.com/im/pictures/miso/Hosting-47826981/original/9dc92703-79e7-4447-8997-ac4372d5a026.jpeg" },
                { "img": "https://a0.muscache.com/im/pictures/miso/Hosting-47826981/original/e95076c2-bd11-45fc-82e1-a018b179217a.jpeg" },
                { "img": "https://a0.muscache.com/im/pictures/miso/Hosting-47826981/original/82393d4d-74e0-4ec9-9aed-5bedec8e61a6.jpeg" },
                { "img": "https://a0.muscache.com/im/pictures/miso/Hosting-47826981/original/d1e86d51-4d33-4ec7-866c-390aa7322e88.jpeg" },
                { "img": "https://a0.muscache.com/im/pictures/miso/Hosting-47769930/original/daa0f374-5820-4d75-a5ce-b9b7384e234a.jpeg" },
                { "img": "https://a0.muscache.com/im/pictures/miso/Hosting-47769930/original/ab98befe-2bc6-4614-a303-9c868d3055a5.png" }
            ]
        }
    }
);

const allListings = db.getCollection('listings').find({}).toArray();

// Print the results to the console.
console.log(allListings);
