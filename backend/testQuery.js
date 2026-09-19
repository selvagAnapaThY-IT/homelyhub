import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const Property = mongoose.connection.db.collection("properties");

  async function testQuery(dest, people, budget, days) {
    const perNight = Number(budget) / Number(days);
    const words = String(dest)
      .toLowerCase()
      .split(/[\s,]+/)
      .filter((w) => w.length >= 2);

    let query = {};
    if (words.length > 0) {
      const regexPattern = words.join("|");
      query.$or = [
        { "address.city": { $regex: regexPattern, $options: "i" } },
        { "address.state": { $regex: regexPattern, $options: "i" } },
        { "address.area": { $regex: regexPattern, $options: "i" } },
      ];
    }

    if (perNight > 0) {
      query.price = { $lte: perNight };
    }

    if (people > 0) {
      query.$and = [
        {
          $or: [
            { maximumGuests: { $gte: Number(people) } },
            { maximumGuest: { $gte: Number(people) } },
            { maximumGuests: { $exists: false }, maximuGuest: { $exists: false } }
          ]
        }
      ];
    }

    const res = await Property.find(query).limit(5).toArray();
    console.log(`Dest: "${dest}", People: ${people}, Budget: ${budget}, PerNight: ${perNight} => Found: ${res.length}`);
    res.forEach((p) => console.log(`  - ${p.propertyName} (Rs ${p.price}, City: ${p.address?.city}, State: ${p.address?.state})`));
  }

  console.log("=== TESTING QUERIES ===");
  await testQuery("Goa, India", 2, 2000000, 3);
  await testQuery("Goa", 2, 2000000, 3);
  await testQuery("North Goa", 2, 2000000, 3);
  await testQuery("Munnar", 2, 15000, 3);
  await testQuery("Kolkata", 2, 5000, 1);
  await testQuery("Paris", 2, 2000000, 3);

  process.exit(0);
}

run().catch(console.error);
