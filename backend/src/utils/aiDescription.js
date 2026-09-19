import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const generateFallbackDescription = (details) => {
  const name = details.propertyName || "Welcome to our property";
  const type = details.propertyType || "stay";
  const room = details.roomType || "accommodation";
  const area = details.address?.area || details.address?.city || "a prime location";
  const extra = details.extraInfo ? ` ${details.extraInfo}` : "";

  return `Experience comfort and warmth at ${name}, a beautiful ${type} offering a wonderful ${room} experience in ${area}.${extra} Perfect for families, solo travelers, and couples looking for a memorable stay with top-notch amenities.`;
};

export const generateDescription = async (details) => {
  try {
    const prompt = `Write an attractive 3-4 sentence listing description for a holiday rental property in India with these details:
- Property Name: ${details.propertyName || ""}
- Property Type: ${details.propertyType || ""}
- Room Type: ${details.roomType || ""}
- Location: ${details.address?.area || ""}, ${details.address?.city || ""}, ${details.address?.state || ""}
- Amenities: ${Array.isArray(details.amenities) ? details.amenities.join(", ") : ""}
- Extra Info: ${details.extraInfo || ""}

Keep the tone welcoming, elegant, and appealing to guests. Do not use emojis. Return ONLY the description text.`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      max_tokens: 300,
      messages: [
        { role: "user", content: prompt },
      ],
    });

    const resultText = completion.choices[0].message.content.trim();
    return resultText || generateFallbackDescription(details);
  } catch (error) {
    console.warn("Groq AI description generation error, using fallback:", error.message);
    return generateFallbackDescription(details);
  }
};
