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

db.technicians.insertMany([
  {
    id: 1,
    cities: ["Isla Mujeres", "Playa del Carmen", "Cancún"],
    specialities: ["Factoring", "Loans", "Mortgages"]
  },
  {
    id: 2,
    cities: ["Tulum", "Cozumel"],
    specialities: ["Investments", "Real Estate"]
  },
  {
    id: 3,
    cities: ["Merida", "Valladolid"],
    specialities: ["Insurance", "Consulting"]
  }
]);

// Verify the insertion
db.technicians.find({});