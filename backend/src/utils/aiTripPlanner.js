import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const systemPrompt = `You are a travel planner for a holiday rental website in India.

Create a day-by-day trip plan from the details the user gives you.

Rules:
1. Give exactly one entry per day of the trip.
2. Each day needs a short title and 3 to 4 activities.
3. Write each activity as "Morning: ...", "Afternoon: ...", or "Evening: ...".
4. Keep the plan inside the budget the user gave, and say roughly what things cost in rupees.
5. Match the activities to the interests the user picked.
6. Only suggest places that really exist in that destination. Do not invent places.
7. Keep the language simple and friendly.
8. Do not use emojis.

Reply with ONLY this JSON shape:
{
  "summary": "two sentences about the trip",
  "days": [
    { "day": 1, "title": "short title", "activities": ["Morning: ...", "Afternoon: ...", "Evening: ..."] }
  ],
  "tips": ["short tip", "short tip", "short tip"]
}`;

const generateFallbackTrip = (trip) => {
  const numDays = Math.max(1, Number(trip.days) || 1);
  const dest = trip.destination || "your destination";
  const interestsList = Array.isArray(trip.interests) && trip.interests.length > 0
    ? trip.interests.join(" and ")
    : "local sight-seeing and relaxation";

  const days = [];
  for (let i = 1; i <= numDays; i++) {
    days.push({
      day: i,
      title: i === 1 ? `Arrival & Highlights of ${dest}` : (i === numDays ? `Final Exploration & Departure` : `Discovering ${dest} - Day ${i}`),
      activities: [
        `Morning: Start your day with a authentic breakfast and explore the heart of ${dest}.`,
        `Afternoon: Visit famous landmarks, enjoying ${interestsList}.`,
        `Evening: Relax at popular local spots and savor local delicacies.`
      ]
    });
  }

  return {
    summary: `A personalized ${numDays}-day itinerary in ${dest} tailored for ${trip.people || 2} guest(s) within a budget of Rs ${trip.budget}.`,
    days,
    tips: [
      `Plan transfers in advance for smooth movement around ${dest}.`,
      `Keep digital copies of IDs and booking confirmations handy.`,
      `Try local culinary specialties for an authentic experience.`
    ]
  };
};

const planTrip = async (trip) => {
  try {
    const tripInfo = `- Destination: ${trip.destination}
- Total Budget: Rs ${trip.budget}
- Number of Days: ${trip.days}
- Number of People: ${trip.people}
- Interests: ${Array.isArray(trip.interests) ? trip.interests.join(", ") : ""}`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      max_tokens: 2000,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: tripInfo },
      ],
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.warn("Groq API trip planning error, using fallback planner:", error.message);
    return generateFallbackTrip(trip);
  }
};

export { planTrip };
