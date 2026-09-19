import { Property } from "../models/propertymodel.js";
import { planTrip } from "../utils/aiTripPlanner.js";
import { generateDescription } from "../utils/aiDescription.js";

const createTripPlan = async (req, res) => {
  try {
    const { destination, budget, days, people, interests } = req.body;
    if (!destination || !budget || !days || !people) {
      return res.status(400).json({ message: "Missing required fields", status: "fail" });
    }

    const plan = await planTrip({ destination, budget, days, people, interests: interests || [] });
    const perNight = Number(budget) / Number(days);

    // Extract search terms from destination (e.g., "Goa, India" -> ["goa", "india"])
    const words = String(destination)
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
        { propertyName: { $regex: regexPattern, $options: "i" } }
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
            { maximumGuests: { $exists: false }, maximumGuest: { $exists: false } }
          ]
        }
      ];
    }

    let properties = await Property.find(query).limit(5);

    // Fallback: If no destination match found in DB, return properties fitting budget & capacity
    if (properties.length === 0) {
      let fallbackQuery = {
        price: { $lte: perNight }
      };
      if (people > 0) {
        fallbackQuery.$or = [
          { maximumGuests: { $gte: Number(people) } },
          { maximumGuest: { $gte: Number(people) } }
        ];
      }
      properties = await Property.find(fallbackQuery).limit(5);
    }

    res.status(200).json({
      status: "success",
      data: {
        plan,
        properties,
        perNight
      }
    });
  } catch (err) {
    console.error("Error creating trip plan:", err);
    res.status(500).json({ message: "could not create trip plan, please try again", status: "fail" });
  }
};

const writeDescription = async (req, res) => {
  try {
    const description = await generateDescription(req.body);
    res.status(200).json({ status: "success", data: { description } });
  } catch (err) {
    console.error("Error generating description:", err);
    res.status(500).json({ message: "could not generate description, please try again", status: "fail" });
  }
};

export { createTripPlan, writeDescription };
