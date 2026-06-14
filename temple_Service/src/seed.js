// src/seed.js
import dotenv from 'dotenv';
dotenv.config();

import connectDB from './db/db.js';
import Temple from './model/temple.model.js';

const templesData = [
  {
    name: "Somnath Temple",
    slug: "somnath-temple",
    location: {
      state: "Gujarat",
      city: "Veraval",
      address: "Prabhas Patan, Veraval"
    },
    deity: "Shiva",
    historicalBackground: "One of the twelve Jyotirlingas, destroyed and rebuilt multiple times. Current temple built in 1951.",
    significance: "First among the twelve Jyotirlingas",
    darshanTimings: [
      { day: "All Days", morningOpen: "6:00 AM", morningClose: "9:00 PM", eveningOpen: "3:00 PM", eveningClose: "9:00 PM", note: "Timings may change on festivals" }
    ],
    festivals: [
      { name: "Maha Shivratri", month: "February-March", description: "Grand celebration with millions of devotees", dateInfo: "Phalgun Krishna Paksha" }
    ],
    visitorGuidelines: {
      dressCode: "Traditional and modest clothing",
      rules: ["No leather items allowed", "Photography restricted in sanctum"],
      photographyAllowed: false,
      entryFee: "Free"
    },
    images: [{ url: "https://example.com/somnath.jpg", caption: "Somnath Temple" }],
    isVerified: true
  },
  {
    name: "Tirupati Balaji Temple",
    slug: "tirupati-balaji-temple",
    location: {
      state: "Andhra Pradesh",
      city: "Tirupati",
      address: "Tirumala Hills"
    },
    deity: "Vishnu",
    historicalBackground: "Ancient temple dedicated to Lord Venkateswara, one of the most visited temples in the world.",
    significance: "Richest temple in India",
    darshanTimings: [
      { day: "All Days", morningOpen: "3:00 AM", morningClose: "11:00 PM", note: "Darshan slots required" }
    ],
    festivals: [
      { name: "Brahmotsavam", month: "September-October", description: "9-day grand festival", dateInfo: "Annually" }
    ],
    visitorGuidelines: {
      dressCode: "Traditional attire (Dhoti for men, Saree for women)",
      rules: ["Hair donation is common", "No mobile phones in sanctum"],
      photographyAllowed: false,
      entryFee: "Free (Special Darshan paid)"
    },
    images: [{ url: "https://example.com/tirupati.jpg", caption: "Tirupati Balaji" }],
    isVerified: true
  },
  {
    name: "Kashi Vishwanath Temple",
    slug: "kashi-vishwanath-temple",
    location: {
      state: "Uttar Pradesh",
      city: "Varanasi",
      address: "Dashashwamedh Ghat"
    },
    deity: "Shiva",
    historicalBackground: "One of the most sacred temples dedicated to Lord Shiva, situated on the banks of River Ganga.",
    significance: "One of the 12 Jyotirlingas",
    darshanTimings: [
      { day: "All Days", morningOpen: "3:00 AM", morningClose: "11:00 PM" }
    ],
    festivals: [
      { name: "Maha Shivratri", month: "February-March", description: "Major festival" }
    ],
    visitorGuidelines: {
      dressCode: "Modest traditional wear",
      rules: ["Security check mandatory"],
      photographyAllowed: false,
      entryFee: "Free"
    },
    isVerified: true
  },
  {
    name: "Vaishno Devi Temple",
    slug: "vaishno-devi-temple",
    location: {
      state: "Jammu and Kashmir",
      city: "Katra",
      address: "Trikuta Mountains"
    },
    deity: "Durga",
    historicalBackground: "Holy cave shrine of Goddess Vaishno Devi.",
    significance: "One of the most revered Shakti Peethas",
    darshanTimings: [
      { day: "All Days", morningOpen: "Open 24 hours", note: "Yatra starts from Katra" }
    ],
    festivals: [
      { name: "Navratri", month: "March-April & September-October", description: "Special celebrations" }
    ],
    visitorGuidelines: {
      dressCode: "Traditional and modest",
      rules: ["No photography allowed inside cave"],
      photographyAllowed: false,
      entryFee: "Free"
    },
    isVerified: true
  },
  {
    name: "Golden Temple",
    slug: "golden-temple",
    location: {
      state: "Punjab",
      city: "Amritsar",
      address: "Harmandir Sahib"
    },
    deity: "Other",
    historicalBackground: "The holiest Gurdwara and the most important pilgrimage site for Sikhs.",
    significance: "Symbol of peace and equality",
    isVerified: true
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Temple.deleteMany({});
    console.log("🗑️ Old temple data cleared");

    // Insert new temples
    const insertedTemples = await Temple.insertMany(templesData);
    
    console.log(`✅ ${insertedTemples.length} temples seeded successfully!`);
    console.log("🎉 Seeding Completed");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding Failed:", error.message);
    process.exit(1);
  }
};

seedDatabase();