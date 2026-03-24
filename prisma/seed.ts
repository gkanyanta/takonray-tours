import { PrismaClient, UserRole, PricingTier, Season } from "@prisma/client";

const prisma = new PrismaClient();

const PASSWORD_HASH = "$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36zQFGiA1bVFl1FvRYeOb2q";

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.bookingAddOn.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.review.deleteMany();
  await prisma.tourAvailability.deleteMany();
  await prisma.tourPricing.deleteMany();
  await prisma.tourAddOn.deleteMany();
  await prisma.roomAvailability.deleteMany();
  await prisma.roomPricing.deleteMany();
  await prisma.roomType.deleteMany();
  await prisma.tour.deleteMany();
  await prisma.tourCategory.deleteMany();
  await prisma.accommodation.deleteMany();
  await prisma.galleryImage.deleteMany();
  await prisma.siteSetting.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // ─── Users ───────────────────────────────────────────────────────────────────

  const superAdmin = await prisma.user.create({
    data: {
      name: "Gerald Mulenga",
      email: "gerald@takonraytours.com",
      password: PASSWORD_HASH,
      phone: "+260971000001",
      nationality: "Zambian",
      role: UserRole.SUPER_ADMIN,
      emailVerified: new Date(),
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: "Chanda Musonda",
      email: "chanda@takonraytours.com",
      password: PASSWORD_HASH,
      phone: "+260972000002",
      nationality: "Zambian",
      role: UserRole.ADMIN,
      emailVerified: new Date(),
    },
  });

  const customer1 = await prisma.user.create({
    data: {
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      password: PASSWORD_HASH,
      phone: "+441234567890",
      nationality: "British",
      role: UserRole.CUSTOMER,
      emailVerified: new Date(),
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      name: "Thabo Moyo",
      email: "thabo.moyo@example.com",
      password: PASSWORD_HASH,
      phone: "+267712345678",
      nationality: "Motswana",
      role: UserRole.CUSTOMER,
      emailVerified: new Date(),
    },
  });

  const customer3 = await prisma.user.create({
    data: {
      name: "Bwalya Chilufya",
      email: "bwalya.c@example.com",
      password: PASSWORD_HASH,
      phone: "+260955123456",
      nationality: "Zambian",
      role: UserRole.CUSTOMER,
      emailVerified: new Date(),
    },
  });

  console.log("Users created.");

  // ─── Tour Categories ─────────────────────────────────────────────────────────

  const categories = await Promise.all([
    prisma.tourCategory.create({
      data: {
        name: "Wildlife Safaris",
        slug: "wildlife-safaris",
        description:
          "Explore Zambia's incredible wildlife in world-renowned national parks and game reserves. From the Big Five to rare bird species, experience Africa's untamed beauty.",
        image: "/images/categories/wildlife-safaris.jpg",
      },
    }),
    prisma.tourCategory.create({
      data: {
        name: "Adventure Activities",
        slug: "adventure-activities",
        description:
          "Get your adrenaline pumping with thrilling activities at Victoria Falls — bungee jumping, white-water rafting, zip-lining, and more.",
        image: "/images/categories/adventure-activities.jpg",
      },
    }),
    prisma.tourCategory.create({
      data: {
        name: "Cultural Tours",
        slug: "cultural-tours",
        description:
          "Discover the rich heritage, traditions, and daily life of Zambia's diverse communities through immersive cultural experiences.",
        image: "/images/categories/cultural-tours.jpg",
      },
    }),
    prisma.tourCategory.create({
      data: {
        name: "River Cruises",
        slug: "river-cruises",
        description:
          "Cruise the mighty Zambezi River and enjoy breathtaking sunsets, hippo pods, and unparalleled views of Victoria Falls.",
        image: "/images/categories/river-cruises.jpg",
      },
    }),
    prisma.tourCategory.create({
      data: {
        name: "Day Trips",
        slug: "day-trips",
        description:
          "Perfect for short stays — explore Livingstone's highlights and nearby attractions in half-day and full-day excursions.",
        image: "/images/categories/day-trips.jpg",
      },
    }),
  ]);

  const [wildlifeCat, adventureCat, culturalCat, cruiseCat, dayTripCat] = categories;

  console.log("Tour categories created.");

  // ─── Tours ───────────────────────────────────────────────────────────────────

  const tours = await Promise.all([
    // Wildlife Safaris
    prisma.tour.create({
      data: {
        name: "Chobe National Park Day Safari",
        slug: "chobe-national-park-day-safari",
        description:
          "Experience one of Africa's greatest wildlife concentrations on this unforgettable day trip to Chobe National Park in Botswana. Depart from Livingstone, cross the border at Kazungula, and enjoy a morning game drive through the park's diverse ecosystems. After a delicious lunch at Chobe Safari Lodge, embark on an afternoon boat cruise along the Chobe River, famous for its massive elephant herds and incredible birdlife. This is a must-do excursion for any visitor to Livingstone.",
        highlights: [
          "Morning game drive through Chobe National Park",
          "Afternoon boat cruise on the Chobe River",
          "See elephants, buffalo, lions, hippos, and crocodiles",
          "Buffet lunch at Chobe Safari Lodge",
          "Border crossing assistance included",
        ],
        duration: "Full day (10-12 hours)",
        maxGroupSize: 12,
        difficulty: "Easy",
        includes: [
          "Return transfers from Livingstone",
          "Park entry fees",
          "Game drive vehicle",
          "Boat cruise",
          "Buffet lunch",
          "Bottled water",
          "Border crossing fees",
        ],
        excludes: ["Visa fees (if applicable)", "Personal items", "Gratuities", "Travel insurance"],
        images: ["/images/tours/chobe-safari-1.jpg", "/images/tours/chobe-safari-2.jpg", "/images/tours/chobe-safari-3.jpg"],
        featured: true,
        categoryId: wildlifeCat.id,
      },
    }),
    prisma.tour.create({
      data: {
        name: "Mosi-oa-Tunya National Park Game Drive",
        slug: "mosi-oa-tunya-game-drive",
        description:
          "Explore Zambia's smallest yet most action-packed national park, located just minutes from Victoria Falls. Mosi-oa-Tunya National Park is home to the protected white rhinos, as well as elephants, giraffes, zebras, and abundant antelope species. Our expert guides will take you on a thrilling open-vehicle game drive through the park, culminating with a visit to the Victoria Falls viewpoint on the Zambian side.",
        highlights: [
          "Track endangered white rhinos on foot with armed rangers",
          "Open-vehicle game drive",
          "Spot elephants, giraffes, zebras, and antelope",
          "Visit the Victoria Falls viewpoint",
          "Expert local guides with deep wildlife knowledge",
        ],
        duration: "Half day (3-4 hours)",
        maxGroupSize: 8,
        difficulty: "Easy",
        includes: ["Hotel pickup and drop-off", "Park entry fees", "Open safari vehicle", "Professional guide", "Bottled water"],
        excludes: ["Victoria Falls entry fee (optional add-on)", "Gratuities", "Personal items"],
        images: ["/images/tours/mosi-oa-tunya-1.jpg", "/images/tours/mosi-oa-tunya-2.jpg"],
        featured: true,
        categoryId: wildlifeCat.id,
      },
    }),

    // Adventure Activities
    prisma.tour.create({
      data: {
        name: "Victoria Falls Bungee Jump",
        slug: "victoria-falls-bungee-jump",
        description:
          "Take the ultimate leap of faith from the iconic Victoria Falls Bridge, plunging 111 metres towards the raging Zambezi River below. This is one of the world's highest commercial bungee jumps, set against the stunning backdrop of the falls and the gorge. Whether you're a first-timer or an experienced jumper, the rush of free-falling with the spray of Victoria Falls on your face is absolutely unforgettable.",
        highlights: [
          "111-metre bungee jump from Victoria Falls Bridge",
          "Stunning views of Victoria Falls and Batoka Gorge",
          "Professional safety briefing and equipment",
          "Certificate of completion",
          "Video and photos available for purchase",
        ],
        duration: "2 hours",
        maxGroupSize: 20,
        difficulty: "Extreme",
        includes: ["Bridge access", "Bungee jump", "Safety equipment", "Certificate", "Light refreshments"],
        excludes: ["Video/photo package", "Transport to bridge", "Gratuities"],
        images: ["/images/tours/bungee-jump-1.jpg", "/images/tours/bungee-jump-2.jpg"],
        featured: true,
        categoryId: adventureCat.id,
      },
    }),
    prisma.tour.create({
      data: {
        name: "Zambezi White Water Rafting",
        slug: "zambezi-white-water-rafting",
        description:
          "Conquer the legendary rapids of the Zambezi River on this exhilarating full-day white water rafting adventure. The Zambezi below Victoria Falls features some of the best commercially run rapids in the world, with Grade 3 to 5 rapids that will test even the most experienced rafters. Navigate through rapids with names like 'The Devil's Toilet Bowl', 'Gnashing Jaws of Death', and 'Oblivion'. This is world-class rafting at its finest.",
        highlights: [
          "Grade 3-5 rapids on the mighty Zambezi",
          "Full-day rafting through Batoka Gorge",
          "Experienced river guides and safety kayakers",
          "Riverside lunch in the gorge",
          "Incredible gorge scenery",
        ],
        duration: "Full day (6-8 hours)",
        maxGroupSize: 14,
        difficulty: "Challenging",
        includes: [
          "All rafting equipment",
          "Professional river guides",
          "Safety kayakers",
          "Lunch and drinks",
          "Transfer back to top of gorge",
        ],
        excludes: ["Transport to put-in point", "Video/photo package", "Gratuities", "Travel insurance"],
        images: ["/images/tours/rafting-1.jpg", "/images/tours/rafting-2.jpg", "/images/tours/rafting-3.jpg"],
        featured: true,
        categoryId: adventureCat.id,
      },
    }),
    prisma.tour.create({
      data: {
        name: "Gorge Swing & Flying Fox",
        slug: "gorge-swing-flying-fox",
        description:
          "Swing out over the dramatic Batoka Gorge on this heart-stopping adventure combo. The gorge swing sends you on a 70-metre free fall before swinging out across the gorge in a giant pendulum arc. Combine it with the Flying Fox — a 135-metre cable slide across the gorge at high speed. Both activities offer breathtaking views of the Zambezi River and the gorge's sheer cliff walls.",
        highlights: [
          "70-metre gorge swing over Batoka Gorge",
          "135-metre Flying Fox cable slide",
          "Breathtaking gorge and river views",
          "Professional guides and top-grade equipment",
          "Combo discount for both activities",
        ],
        duration: "2-3 hours",
        maxGroupSize: 16,
        difficulty: "Hard",
        includes: ["All equipment", "Safety briefing", "Professional guides", "Light refreshments"],
        excludes: ["Transport to site", "Video/photo package", "Gratuities"],
        images: ["/images/tours/gorge-swing-1.jpg", "/images/tours/gorge-swing-2.jpg"],
        featured: false,
        categoryId: adventureCat.id,
      },
    }),

    // Cultural Tours
    prisma.tour.create({
      data: {
        name: "Mukuni Village Cultural Experience",
        slug: "mukuni-village-cultural-experience",
        description:
          "Step into the heart of Zambian culture with a guided visit to Mukuni Village, a living community of over 7,000 people ruled by Chief Mukuni. This is not a staged tourist attraction but a real, thriving village where you will witness daily life, traditional crafts, and ancient customs that have been preserved for centuries. Meet the village headman, visit a traditional healer, watch craftspeople at work, and learn about the Leya people's deep connection to Victoria Falls.",
        highlights: [
          "Visit a living village of over 7,000 residents",
          "Meet the village headman and learn about chieftainship",
          "Watch traditional crafts — basket weaving, wood carving, pottery",
          "Visit a traditional healer's homestead",
          "Learn about the Leya people's history and connection to Victoria Falls",
        ],
        duration: "Half day (3 hours)",
        maxGroupSize: 10,
        difficulty: "Easy",
        includes: ["Local guide", "Village entry fee", "Cultural demonstration", "Traditional refreshment", "Hotel transfers"],
        excludes: ["Craft purchases", "Gratuities", "Personal items"],
        images: ["/images/tours/mukuni-village-1.jpg", "/images/tours/mukuni-village-2.jpg"],
        featured: true,
        categoryId: culturalCat.id,
      },
    }),
    prisma.tour.create({
      data: {
        name: "Livingstone City Heritage Walk",
        slug: "livingstone-city-heritage-walk",
        description:
          "Discover the colonial and pre-colonial history of Livingstone on this fascinating walking tour through Zambia's tourism capital. Visit the Livingstone Museum — the oldest and largest in Zambia — explore the bustling Maramba Market, see colonial-era buildings, and learn about David Livingstone's famous explorations. End the tour at the Royal Livingstone Hotel for refreshments overlooking the Zambezi River.",
        highlights: [
          "Guided tour of Livingstone Museum",
          "Walk through historic colonial-era buildings",
          "Experience the vibrant Maramba Market",
          "Learn about David Livingstone and early explorers",
          "Refreshments overlooking the Zambezi",
        ],
        duration: "Half day (4 hours)",
        maxGroupSize: 12,
        difficulty: "Easy",
        includes: ["Walking guide", "Museum entry", "Refreshments", "Hotel pickup"],
        excludes: ["Market purchases", "Gratuities", "Lunch"],
        images: ["/images/tours/livingstone-heritage-1.jpg", "/images/tours/livingstone-heritage-2.jpg"],
        featured: false,
        categoryId: culturalCat.id,
      },
    }),

    // River Cruises
    prisma.tour.create({
      data: {
        name: "Zambezi Sunset Cruise",
        slug: "zambezi-sunset-cruise",
        description:
          "There is no better way to end a day in Livingstone than with a leisurely sunset cruise on the Upper Zambezi River. Glide past hippo pods, watch elephants come to the riverbank to drink, and marvel at an extraordinary African sunset that paints the sky in shades of gold, orange, and crimson. Enjoy unlimited drinks and a selection of canapés as your experienced captain navigates the calm waters above the falls.",
        highlights: [
          "Cruise the Upper Zambezi above Victoria Falls",
          "Spectacular African sunset views",
          "Spot hippos, elephants, and crocodiles",
          "Unlimited drinks and gourmet canapés",
          "Live commentary on local wildlife and history",
        ],
        duration: "2.5 hours",
        maxGroupSize: 30,
        difficulty: "Easy",
        includes: ["Return hotel transfers", "Sunset cruise", "Unlimited drinks", "Canapés", "National park levy"],
        excludes: ["Gratuities", "Personal items"],
        images: ["/images/tours/sunset-cruise-1.jpg", "/images/tours/sunset-cruise-2.jpg", "/images/tours/sunset-cruise-3.jpg"],
        featured: true,
        categoryId: cruiseCat.id,
      },
    }),
    prisma.tour.create({
      data: {
        name: "Breakfast Cruise & Falls Tour",
        slug: "breakfast-cruise-falls-tour",
        description:
          "Start your morning with a tranquil breakfast cruise on the Zambezi River, followed by a guided tour of Victoria Falls on the Zambian side. Enjoy a full English breakfast with fresh fruit and pastries while cruising past islands teeming with birdlife. After disembarking, your guide will lead you through the rainforest trails of the Victoria Falls National Park, where you will experience the thunder and spray of Mosi-oa-Tunya up close.",
        highlights: [
          "Morning breakfast cruise on the Zambezi",
          "Full English breakfast with fresh juices",
          "Guided walking tour of Victoria Falls (Zambian side)",
          "Rainforest trail walk with spectacular viewpoints",
          "Expert guide with deep knowledge of the falls",
        ],
        duration: "Half day (5 hours)",
        maxGroupSize: 20,
        difficulty: "Easy",
        includes: ["Hotel transfers", "Breakfast cruise", "Full breakfast", "Falls entry fee", "Raincoat/poncho", "Guide"],
        excludes: ["Gratuities", "Personal items", "Additional drinks"],
        images: ["/images/tours/breakfast-cruise-1.jpg", "/images/tours/breakfast-cruise-2.jpg"],
        featured: false,
        categoryId: cruiseCat.id,
      },
    }),

    // Day Trips
    prisma.tour.create({
      data: {
        name: "Victoria Falls Guided Tour",
        slug: "victoria-falls-guided-tour",
        description:
          "Witness the sheer power and majesty of Victoria Falls — one of the Seven Natural Wonders of the World — on this guided walking tour. Known locally as Mosi-oa-Tunya ('The Smoke That Thunders'), the falls stretch 1,708 metres wide and plunge up to 108 metres into the gorge below. Walk along the network of rainforest paths and viewpoints on the Zambian side, getting up close to the thundering curtain of water. During peak flow season (February to May), be prepared to get completely drenched by the spray!",
        highlights: [
          "Walk along the Zambian side of Victoria Falls",
          "Multiple viewpoints with different perspectives",
          "Learn about the geology, history, and ecology of the falls",
          "Knife Edge Bridge for panoramic views",
          "Eastern Cataract and Boiling Pot viewpoints",
        ],
        duration: "2-3 hours",
        maxGroupSize: 15,
        difficulty: "Easy",
        includes: ["Park entry fee", "Professional guide", "Raincoat/poncho", "Hotel pickup and drop-off", "Bottled water"],
        excludes: ["Gratuities", "Personal items", "Curio purchases"],
        images: ["/images/tours/vic-falls-tour-1.jpg", "/images/tours/vic-falls-tour-2.jpg", "/images/tours/vic-falls-tour-3.jpg"],
        featured: true,
        categoryId: dayTripCat.id,
      },
    }),
  ]);

  console.log("Tours created.");

  // ─── Tour Pricing ────────────────────────────────────────────────────────────

  const tourPricingData: { tourIndex: number; local: number[]; sadc: number[]; international: number[] }[] = [
    // Chobe Safari: [peak, high, low]
    { tourIndex: 0, local: [120, 100, 80], sadc: [160, 140, 110], international: [220, 190, 160] },
    // Mosi-oa-Tunya Game Drive
    { tourIndex: 1, local: [45, 40, 35], sadc: [65, 55, 45], international: [95, 80, 65] },
    // Bungee Jump
    { tourIndex: 2, local: [80, 80, 70], sadc: [120, 110, 100], international: [160, 150, 130] },
    // White Water Rafting
    { tourIndex: 3, local: [100, 90, 75], sadc: [140, 120, 100], international: [180, 160, 130] },
    // Gorge Swing & Flying Fox
    { tourIndex: 4, local: [70, 65, 55], sadc: [100, 90, 75], international: [140, 120, 100] },
    // Mukuni Village
    { tourIndex: 5, local: [25, 25, 20], sadc: [40, 35, 30], international: [60, 50, 40] },
    // Livingstone Heritage Walk
    { tourIndex: 6, local: [20, 20, 15], sadc: [35, 30, 25], international: [55, 45, 35] },
    // Sunset Cruise
    { tourIndex: 7, local: [50, 45, 35], sadc: [75, 65, 50], international: [110, 95, 75] },
    // Breakfast Cruise & Falls
    { tourIndex: 8, local: [65, 55, 45], sadc: [90, 80, 65], international: [130, 115, 95] },
    // Victoria Falls Guided Tour
    { tourIndex: 9, local: [30, 25, 20], sadc: [50, 40, 35], international: [75, 65, 50] },
  ];

  const seasons: Season[] = [Season.PEAK, Season.HIGH, Season.LOW];
  const tiers: { tier: PricingTier; key: "local" | "sadc" | "international" }[] = [
    { tier: PricingTier.LOCAL, key: "local" },
    { tier: PricingTier.SADC, key: "sadc" },
    { tier: PricingTier.INTERNATIONAL, key: "international" },
  ];

  for (const tp of tourPricingData) {
    for (const t of tiers) {
      for (let s = 0; s < seasons.length; s++) {
        await prisma.tourPricing.create({
          data: {
            tourId: tours[tp.tourIndex].id,
            tier: t.tier,
            season: seasons[s],
            price: tp[t.key][s],
          },
        });
      }
    }
  }

  console.log("Tour pricing created.");

  // ─── Tour Add-Ons ────────────────────────────────────────────────────────────

  const addOns = await Promise.all([
    prisma.tourAddOn.create({
      data: { tourId: tours[0].id, name: "Professional Photography Package", description: "A professional photographer joins your safari and delivers 50+ edited photos", price: 75 },
    }),
    prisma.tourAddOn.create({
      data: { tourId: tours[0].id, name: "Binoculars Rental", description: "High-quality binoculars for the day", price: 15 },
    }),
    prisma.tourAddOn.create({
      data: { tourId: tours[2].id, name: "Video & Photo Package", description: "HD video and photos of your bungee jump", price: 50 },
    }),
    prisma.tourAddOn.create({
      data: { tourId: tours[2].id, name: "T-shirt", description: "Official Victoria Falls Bungee t-shirt", price: 20 },
    }),
    prisma.tourAddOn.create({
      data: { tourId: tours[3].id, name: "GoPro Rental", description: "Mounted GoPro for in-raft footage", price: 35 },
    }),
    prisma.tourAddOn.create({
      data: { tourId: tours[7].id, name: "Private Deck Upgrade", description: "Reserved private upper deck seating", price: 30 },
    }),
    prisma.tourAddOn.create({
      data: { tourId: tours[7].id, name: "Champagne Upgrade", description: "Upgrade to premium champagne and canapés", price: 40 },
    }),
    prisma.tourAddOn.create({
      data: { tourId: tours[9].id, name: "Poncho Purchase", description: "Keep your Victoria Falls rain poncho as a souvenir", price: 10 },
    }),
  ]);

  console.log("Tour add-ons created.");

  // ─── Tour Availability (next 90 days) ────────────────────────────────────────

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const tour of tours) {
    for (let d = 1; d <= 90; d++) {
      const date = addDays(today, d);
      // Skip some random days to simulate unavailability
      if (d % 7 === 0) continue; // no tours on every 7th day

      await prisma.tourAvailability.create({
        data: {
          tourId: tour.id,
          date,
          slots: tour.maxGroupSize,
          booked: Math.floor(Math.random() * Math.min(4, tour.maxGroupSize)),
        },
      });
    }
  }

  console.log("Tour availability created.");

  // ─── Accommodations ──────────────────────────────────────────────────────────

  const accommodations = await Promise.all([
    prisma.accommodation.create({
      data: {
        name: "Takonray River Lodge",
        slug: "takonray-river-lodge",
        description:
          "Nestled on the banks of the Zambezi River, Takonray River Lodge offers luxury accommodation with stunning river views. Wake up to the sound of hippos and birdsong, enjoy sundowners on your private deck, and fall asleep under the stars. Our lodge combines authentic African charm with modern comforts, making it the perfect base for your Livingstone adventure.",
        type: "lodge",
        address: "Sichango Road, Livingstone, Zambia",
        amenities: ["Swimming pool", "River-view restaurant", "Wi-Fi", "Air conditioning", "Laundry service", "Airport transfers", "Safari desk", "Spa treatments", "Bar", "Garden"],
        images: ["/images/accommodations/river-lodge-1.jpg", "/images/accommodations/river-lodge-2.jpg", "/images/accommodations/river-lodge-3.jpg"],
        rating: 4.8,
        featured: true,
      },
    }),
    prisma.accommodation.create({
      data: {
        name: "Falls View Hotel",
        slug: "falls-view-hotel",
        description:
          "Located in the heart of Livingstone, Falls View Hotel offers comfortable, modern rooms with easy access to Victoria Falls and the town centre. Our rooftop terrace provides panoramic views of the spray from the falls. Ideal for travellers seeking quality accommodation at a mid-range price point.",
        type: "hotel",
        address: "Mosi-oa-Tunya Road, Livingstone, Zambia",
        amenities: ["Rooftop terrace", "Restaurant", "Wi-Fi", "Air conditioning", "24-hour front desk", "Parking", "Tour desk", "Conference room"],
        images: ["/images/accommodations/falls-view-1.jpg", "/images/accommodations/falls-view-2.jpg"],
        rating: 4.3,
        featured: true,
      },
    }),
    prisma.accommodation.create({
      data: {
        name: "Zambezi Guesthouse",
        slug: "zambezi-guesthouse",
        description:
          "A warm, family-run guesthouse in a quiet residential area of Livingstone. Zambezi Guesthouse offers clean, comfortable rooms with a homely atmosphere. Enjoy home-cooked Zambian meals, relax in the lush garden, and benefit from the personal attention of our experienced hosts who know Livingstone inside and out.",
        type: "guesthouse",
        address: "Nakatindi Road, Livingstone, Zambia",
        amenities: ["Home-cooked meals", "Garden", "Wi-Fi", "Fan/AC", "Secure parking", "Laundry", "Local tips from hosts"],
        images: ["/images/accommodations/guesthouse-1.jpg", "/images/accommodations/guesthouse-2.jpg"],
        rating: 4.5,
        featured: false,
      },
    }),
    prisma.accommodation.create({
      data: {
        name: "Batoka Gorge Campsite",
        slug: "batoka-gorge-campsite",
        description:
          "For adventurous travellers who want to sleep under the African sky, Batoka Gorge Campsite is the perfect choice. Set on the edge of the dramatic Batoka Gorge, our campsite offers well-maintained pitches, clean ablution facilities, and a communal bush kitchen. Pre-pitched safari tents are also available for those who want the camping experience without the hassle.",
        type: "camping",
        address: "Batoka Gorge Road, Livingstone, Zambia",
        amenities: ["Ablution block", "Bush kitchen", "Braai/BBQ areas", "Security", "Parking", "Camp shop", "Gorge views", "Wi-Fi (common area)"],
        images: ["/images/accommodations/campsite-1.jpg", "/images/accommodations/campsite-2.jpg"],
        rating: 4.1,
        featured: false,
      },
    }),
  ]);

  console.log("Accommodations created.");

  // ─── Room Types ──────────────────────────────────────────────────────────────

  const roomTypes = await Promise.all([
    // Takonray River Lodge
    prisma.roomType.create({
      data: {
        accommodationId: accommodations[0].id,
        name: "Standard River Room",
        description: "Comfortable room with garden and partial river views. Queen bed, en-suite bathroom, private balcony.",
        maxOccupancy: 2,
        images: ["/images/rooms/river-lodge-standard-1.jpg"],
      },
    }),
    prisma.roomType.create({
      data: {
        accommodationId: accommodations[0].id,
        name: "Luxury River Suite",
        description: "Spacious suite with panoramic Zambezi views. King bed, separate lounge, outdoor shower, plunge pool on deck.",
        maxOccupancy: 2,
        images: ["/images/rooms/river-lodge-suite-1.jpg"],
      },
    }),
    prisma.roomType.create({
      data: {
        accommodationId: accommodations[0].id,
        name: "Family Chalet",
        description: "Two-bedroom chalet ideal for families. Main bedroom with king bed, second room with twin beds, shared lounge and bathroom.",
        maxOccupancy: 4,
        images: ["/images/rooms/river-lodge-family-1.jpg"],
      },
    }),
    // Falls View Hotel
    prisma.roomType.create({
      data: {
        accommodationId: accommodations[1].id,
        name: "Standard Double",
        description: "Clean, modern room with double bed, en-suite bathroom, TV, and air conditioning.",
        maxOccupancy: 2,
        images: ["/images/rooms/falls-view-standard-1.jpg"],
      },
    }),
    prisma.roomType.create({
      data: {
        accommodationId: accommodations[1].id,
        name: "Deluxe Twin",
        description: "Spacious room with two single beds, work desk, minibar, and city views.",
        maxOccupancy: 2,
        images: ["/images/rooms/falls-view-deluxe-1.jpg"],
      },
    }),
    // Zambezi Guesthouse
    prisma.roomType.create({
      data: {
        accommodationId: accommodations[2].id,
        name: "Single Room",
        description: "Cosy single room with fan, shared bathroom, and garden access.",
        maxOccupancy: 1,
        images: ["/images/rooms/guesthouse-single-1.jpg"],
      },
    }),
    prisma.roomType.create({
      data: {
        accommodationId: accommodations[2].id,
        name: "Double Room (En-suite)",
        description: "Comfortable double room with en-suite bathroom, air conditioning, and mosquito nets.",
        maxOccupancy: 2,
        images: ["/images/rooms/guesthouse-double-1.jpg"],
      },
    }),
    // Batoka Gorge Campsite
    prisma.roomType.create({
      data: {
        accommodationId: accommodations[3].id,
        name: "Camp Pitch",
        description: "Flat, shaded camping pitch with power outlet. Bring your own tent and gear.",
        maxOccupancy: 4,
        images: ["/images/rooms/campsite-pitch-1.jpg"],
      },
    }),
    prisma.roomType.create({
      data: {
        accommodationId: accommodations[3].id,
        name: "Safari Tent",
        description: "Pre-pitched canvas safari tent with camp beds, linen, and solar lantern. Glamping made easy.",
        maxOccupancy: 2,
        images: ["/images/rooms/campsite-safari-tent-1.jpg"],
      },
    }),
  ]);

  console.log("Room types created.");

  // ─── Room Pricing ────────────────────────────────────────────────────────────

  // [peak, high, low] per night in USD
  const roomPricingData: { roomIndex: number; local: number[]; sadc: number[]; international: number[] }[] = [
    // Takonray River Lodge
    { roomIndex: 0, local: [80, 65, 50], sadc: [120, 100, 75], international: [180, 150, 110] },
    { roomIndex: 1, local: [150, 120, 90], sadc: [220, 180, 140], international: [320, 270, 200] },
    { roomIndex: 2, local: [130, 110, 85], sadc: [190, 160, 120], international: [280, 240, 180] },
    // Falls View Hotel
    { roomIndex: 3, local: [50, 40, 30], sadc: [75, 60, 45], international: [110, 90, 65] },
    { roomIndex: 4, local: [60, 50, 38], sadc: [90, 75, 55], international: [130, 110, 80] },
    // Zambezi Guesthouse
    { roomIndex: 5, local: [20, 18, 15], sadc: [30, 25, 20], international: [45, 38, 28] },
    { roomIndex: 6, local: [35, 30, 22], sadc: [50, 42, 32], international: [70, 58, 42] },
    // Batoka Gorge Campsite
    { roomIndex: 7, local: [8, 8, 6], sadc: [12, 10, 8], international: [18, 15, 10] },
    { roomIndex: 8, local: [25, 22, 18], sadc: [38, 32, 25], international: [55, 45, 35] },
  ];

  for (const rp of roomPricingData) {
    for (const t of tiers) {
      for (let s = 0; s < seasons.length; s++) {
        await prisma.roomPricing.create({
          data: {
            roomTypeId: roomTypes[rp.roomIndex].id,
            tier: t.tier,
            season: seasons[s],
            price: rp[t.key][s],
          },
        });
      }
    }
  }

  console.log("Room pricing created.");

  // ─── Room Availability (next 90 days) ────────────────────────────────────────

  const roomCounts = [6, 3, 2, 10, 8, 4, 5, 15, 6];

  for (let r = 0; r < roomTypes.length; r++) {
    for (let d = 1; d <= 90; d++) {
      const date = addDays(today, d);
      const total = roomCounts[r];
      await prisma.roomAvailability.create({
        data: {
          roomTypeId: roomTypes[r].id,
          date,
          rooms: total,
          booked: Math.floor(Math.random() * Math.min(3, total)),
        },
      });
    }
  }

  console.log("Room availability created.");

  // ─── Reviews ─────────────────────────────────────────────────────────────────

  await Promise.all([
    prisma.review.create({
      data: {
        userId: customer1.id,
        tourId: tours[0].id,
        rating: 5,
        comment: "Absolutely incredible day! We saw so many elephants along the Chobe River, plus lions, hippos, and even a leopard in the distance. Our guide was extremely knowledgeable and the lunch was delicious. Highly recommend this safari to anyone visiting Livingstone.",
        approved: true,
      },
    }),
    prisma.review.create({
      data: {
        userId: customer2.id,
        tourId: tours[0].id,
        rating: 4,
        comment: "Great experience overall. The boat cruise in the afternoon was the highlight — so many hippos! The only downside was the long wait at the Kazungula border crossing, but that is to be expected. The guide was fantastic.",
        approved: true,
      },
    }),
    prisma.review.create({
      data: {
        userId: customer1.id,
        tourId: tours[2].id,
        rating: 5,
        comment: "The most thrilling experience of my life! Jumping 111 metres towards the Zambezi was absolutely terrifying and exhilarating at the same time. The crew were very professional and made me feel safe throughout. Do it — you won't regret it!",
        approved: true,
      },
    }),
    prisma.review.create({
      data: {
        userId: customer3.id,
        tourId: tours[5].id,
        rating: 5,
        comment: "This was the most meaningful part of our trip. Meeting the people of Mukuni Village and learning about their way of life was humbling and inspiring. Our guide translated everything and the village was so welcoming. A must-do in Livingstone.",
        approved: true,
      },
    }),
    prisma.review.create({
      data: {
        userId: customer2.id,
        tourId: tours[7].id,
        rating: 5,
        comment: "What a way to end the day! The sunset over the Zambezi was spectacular. We saw hippos, elephants coming to drink, and even a fish eagle. The drinks and snacks were top quality. Perfect romantic evening.",
        approved: true,
      },
    }),
    prisma.review.create({
      data: {
        userId: customer3.id,
        tourId: tours[9].id,
        rating: 4,
        comment: "Victoria Falls is truly one of the wonders of the world. Our guide was very informative about the geology and history. We got absolutely soaked at the Knife Edge Bridge — bring a waterproof bag for your phone! Amazing experience.",
        approved: true,
      },
    }),
    prisma.review.create({
      data: {
        userId: customer1.id,
        tourId: tours[3].id,
        rating: 5,
        comment: "Best white water rafting I have ever done! The rapids are intense and the scenery through Batoka Gorge is unreal. Our guide kept us safe through some seriously big water. The lunch stop on the riverbank was a nice touch too.",
        approved: true,
      },
    }),
    // Accommodation reviews
    prisma.review.create({
      data: {
        userId: customer1.id,
        accommodationId: accommodations[0].id,
        rating: 5,
        comment: "Takonray River Lodge exceeded all our expectations. The river suite was gorgeous with an amazing view of the Zambezi. We watched hippos from our plunge pool! The staff were incredibly warm and helpful. Will definitely return.",
        approved: true,
      },
    }),
    prisma.review.create({
      data: {
        userId: customer2.id,
        accommodationId: accommodations[1].id,
        rating: 4,
        comment: "Good value for money. Clean, modern rooms and a great location right on the main road. The rooftop terrace is a nice bonus — you can see the spray from the falls on a clear day. Breakfast was decent.",
        approved: true,
      },
    }),
    prisma.review.create({
      data: {
        userId: customer3.id,
        accommodationId: accommodations[2].id,
        rating: 5,
        comment: "Staying at Zambezi Guesthouse felt like staying with family. The home-cooked nshima dinner was incredible and our hosts gave us the best tips for things to do in Livingstone. Simple but clean and comfortable. Loved it.",
        approved: true,
      },
    }),
    prisma.review.create({
      data: {
        userId: customer2.id,
        accommodationId: accommodations[3].id,
        rating: 4,
        comment: "Great campsite with a stunning location on the edge of the gorge. The safari tent was comfortable and well-equipped. Ablutions were clean. The braai area was perfect for an evening under the stars. Good budget option.",
        approved: true,
      },
    }),
  ]);

  console.log("Reviews created.");

  // ─── Gallery Images ──────────────────────────────────────────────────────────

  await Promise.all([
    prisma.galleryImage.create({ data: { url: "/images/gallery/victoria-falls-aerial.jpg", caption: "Aerial view of Victoria Falls in full flow", category: "Victoria Falls", order: 1 } }),
    prisma.galleryImage.create({ data: { url: "/images/gallery/victoria-falls-rainbow.jpg", caption: "Double rainbow over Victoria Falls", category: "Victoria Falls", order: 2 } }),
    prisma.galleryImage.create({ data: { url: "/images/gallery/zambezi-sunset.jpg", caption: "Golden sunset over the Zambezi River", category: "River", order: 3 } }),
    prisma.galleryImage.create({ data: { url: "/images/gallery/elephant-chobe.jpg", caption: "Elephant herd crossing the Chobe River", category: "Wildlife", order: 4 } }),
    prisma.galleryImage.create({ data: { url: "/images/gallery/lion-chobe.jpg", caption: "Male lion in Chobe National Park", category: "Wildlife", order: 5 } }),
    prisma.galleryImage.create({ data: { url: "/images/gallery/hippo-zambezi.jpg", caption: "Hippos in the Upper Zambezi", category: "Wildlife", order: 6 } }),
    prisma.galleryImage.create({ data: { url: "/images/gallery/bungee-jump.jpg", caption: "Bungee jumping off Victoria Falls Bridge", category: "Adventure", order: 7 } }),
    prisma.galleryImage.create({ data: { url: "/images/gallery/white-water-rafting.jpg", caption: "Tackling Grade 5 rapids on the Zambezi", category: "Adventure", order: 8 } }),
    prisma.galleryImage.create({ data: { url: "/images/gallery/mukuni-village.jpg", caption: "Traditional dance at Mukuni Village", category: "Culture", order: 9 } }),
    prisma.galleryImage.create({ data: { url: "/images/gallery/sunset-cruise.jpg", caption: "Guests enjoying a Zambezi sunset cruise", category: "River", order: 10 } }),
    prisma.galleryImage.create({ data: { url: "/images/gallery/batoka-gorge.jpg", caption: "The dramatic Batoka Gorge below the falls", category: "Scenery", order: 11 } }),
    prisma.galleryImage.create({ data: { url: "/images/gallery/fish-eagle.jpg", caption: "African fish eagle on the Zambezi", category: "Wildlife", order: 12 } }),
    prisma.galleryImage.create({ data: { url: "/images/gallery/river-lodge-exterior.jpg", caption: "Takonray River Lodge at dusk", category: "Accommodation", order: 13 } }),
    prisma.galleryImage.create({ data: { url: "/images/gallery/livingstone-museum.jpg", caption: "The historic Livingstone Museum", category: "Culture", order: 14 } }),
    prisma.galleryImage.create({ data: { url: "/images/gallery/giraffe-mosi-oa-tunya.jpg", caption: "Giraffe in Mosi-oa-Tunya National Park", category: "Wildlife", order: 15 } }),
  ]);

  console.log("Gallery images created.");

  // ─── Site Settings ───────────────────────────────────────────────────────────

  await Promise.all([
    prisma.siteSetting.create({ data: { key: "site_name", value: "Takonray Tours" } }),
    prisma.siteSetting.create({ data: { key: "site_tagline", value: "Your Gateway to Victoria Falls & Beyond" } }),
    prisma.siteSetting.create({ data: { key: "site_description", value: "Takonray Tours is a Livingstone-based tour operator offering wildlife safaris, adventure activities, cultural experiences, river cruises, and accommodation in Zambia's tourism capital." } }),
    prisma.siteSetting.create({ data: { key: "contact_email", value: "info@takonraytours.com" } }),
    prisma.siteSetting.create({ data: { key: "contact_phone", value: "+260971000001" } }),
    prisma.siteSetting.create({ data: { key: "contact_whatsapp", value: "+260971000001" } }),
    prisma.siteSetting.create({ data: { key: "contact_address", value: "Mosi-oa-Tunya Road, Livingstone, Zambia" } }),
    prisma.siteSetting.create({ data: { key: "social_facebook", value: "https://facebook.com/takonraytours" } }),
    prisma.siteSetting.create({ data: { key: "social_instagram", value: "https://instagram.com/takonraytours" } }),
    prisma.siteSetting.create({ data: { key: "social_twitter", value: "https://twitter.com/takonraytours" } }),
    prisma.siteSetting.create({ data: { key: "social_tiktok", value: "https://tiktok.com/@takonraytours" } }),
    prisma.siteSetting.create({ data: { key: "currency", value: "USD" } }),
    prisma.siteSetting.create({ data: { key: "timezone", value: "Africa/Lusaka" } }),
    prisma.siteSetting.create({ data: { key: "peak_season_months", value: "2,3,4,5" } }),
    prisma.siteSetting.create({ data: { key: "high_season_months", value: "6,7,8,9,10" } }),
    prisma.siteSetting.create({ data: { key: "low_season_months", value: "11,12,1" } }),
    prisma.siteSetting.create({ data: { key: "deposit_percentage", value: "30" } }),
    prisma.siteSetting.create({ data: { key: "cancellation_policy", value: "Free cancellation up to 48 hours before the activity. 50% charge for cancellations within 48 hours. No refund for no-shows." } }),
    prisma.siteSetting.create({ data: { key: "sadc_countries", value: "Angola,Botswana,Comoros,DRC,Eswatini,Lesotho,Madagascar,Malawi,Mauritius,Mozambique,Namibia,Seychelles,South Africa,Tanzania,Zambia,Zimbabwe" } }),
  ]);

  console.log("Site settings created.");
  console.log("Seeding complete!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
