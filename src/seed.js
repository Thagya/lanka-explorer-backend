import 'dotenv/config'
import mongoose from 'mongoose'
import User from './models/User.js'
import Listing from './models/Listing.js'
import Attraction from './models/Attraction.js'
import Booking from './models/Booking.js'

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/lanka_explorer'

const attractions = [
  {
    name: 'Sigiriya Rock Fortress',
    category: 'Historical',
    region: 'Central Province',
    address: 'Sigiriya, Matale District, Central Province, Sri Lanka',
    lat: 7.9570, lng: 80.7603,
    images: [
      'https://images.unsplash.com/photo-1588416936097-41850ab3d86d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80',
    ],
    shortDescription: 'Ancient rock fortress and UNESCO World Heritage Site rising 200m above the jungle.',
    description: 'Sigiriya, known as Lion Rock, is an ancient rock fortress and palace ruin in the central Matale District. Built by King Kashyapa in the 5th century, it features stunning frescoes, mirror wall inscriptions, landscaped water gardens, and panoramic views from the 200 m summit.',
    openingHours: '7:00 AM – 5:30 PM',
    entryFee: 'USD 30 (foreigners) / LKR 100 (locals)',
    rating: 4.9,
    tags: ['UNESCO', 'Ancient', 'Hiking', 'History'],
  },
  {
    name: 'Temple of the Tooth Relic',
    category: 'Cultural',
    region: 'Kandy',
    address: 'Sri Dalada Veediya, Kandy 20000, Sri Lanka',
    lat: 7.2936, lng: 80.6413,
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1609803384069-19f3f41b5609?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=800&q=80',
    ],
    shortDescription: 'Sacred Buddhist temple housing the relic of the tooth of the Buddha.',
    description: 'Sri Dalada Maligawa is a Buddhist temple in the royal palace complex of the former Kingdom of Kandy. It houses the relic of the tooth of the Buddha and is one of the most venerated pilgrimage sites in the Buddhist world, added to the UNESCO World Heritage List in 1988.',
    openingHours: '5:30 AM – 8:00 PM',
    entryFee: 'LKR 1500 (foreigners) / Free (locals)',
    rating: 4.8,
    tags: ['Buddhist', 'Sacred', 'UNESCO', 'Cultural'],
  },
  {
    name: 'Yala National Park',
    category: 'Wildlife',
    region: 'Southern Province',
    address: 'Palatupana, Kirinda, Tissamaharama, Southern Province, Sri Lanka',
    lat: 6.3728, lng: 81.5216,
    images: [
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551085254-e96b210db58a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=800&q=80',
    ],
    shortDescription: 'Sri Lanka\'s most visited national park, home to leopards, elephants and diverse wildlife.',
    description: 'Yala National Park is the most visited and second largest national park in Sri Lanka, located in the southeast corner of the island. The park is renowned for having the highest density of leopards in the world. It also hosts elephants, sloth bears, crocodiles, and over 200 bird species across 979 km² of wilderness.',
    openingHours: '6:00 AM – 6:00 PM',
    entryFee: 'USD 25 per person + vehicle charges',
    rating: 4.7,
    tags: ['Wildlife', 'Safari', 'Leopard', 'Nature'],
  },
  {
    name: 'Mirissa Beach',
    category: 'Beach',
    region: 'Southern Province',
    address: 'Mirissa, Matara District, Southern Province, Sri Lanka',
    lat: 5.9485, lng: 80.4716,
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=800&q=80',
    ],
    shortDescription: 'Stunning crescent-shaped beach perfect for surfing and whale watching.',
    description: 'Mirissa is a small coastal town on the south coast of Sri Lanka, about 150 km from Colombo. The crescent-shaped golden beach is perfect for swimming and surfing, while the waters off Mirissa are among the best places in the world to spot blue whales and sperm whales between November and April.',
    openingHours: 'Open 24 hours',
    entryFee: 'Free',
    rating: 4.6,
    tags: ['Beach', 'Surfing', 'Whale Watching', 'Sunset'],
  },
  {
    name: 'Nine Arch Bridge',
    category: 'Scenic',
    region: 'Uva Province',
    address: 'Demodara, Ella, Badulla District, Uva Province, Sri Lanka',
    lat: 6.8789, lng: 81.0572,
    images: [
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=800&q=80',
    ],
    shortDescription: 'Iconic colonial-era viaduct surrounded by lush tea plantations in Ella.',
    description: 'The Nine Arch Bridge in Ella, also called the Bridge in the Sky, is one of the finest examples of colonial-era railway construction in Sri Lanka. Built around 1921 entirely from stone, brick and cement without any steel, it stretches 91 m across a lush valley of tea estates and jungle between Ella and Demodara stations.',
    openingHours: 'Open 24 hours (trains pass at approx. 9 AM & 3 PM)',
    entryFee: 'Free',
    rating: 4.8,
    tags: ['Scenic', 'Railway', 'Colonial', 'Tea Country'],
  },
  {
    name: 'Galle Fort',
    category: 'Historical',
    region: 'Southern Province',
    address: 'Galle Fort, Galle 80000, Southern Province, Sri Lanka',
    lat: 6.0269, lng: 80.2167,
    images: [
      'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586375300773-8384e3e4916f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
    ],
    shortDescription: 'UNESCO-listed Dutch colonial fort with charming cobbled streets and ocean views.',
    description: 'Galle Fort was first built by the Portuguese in 1588 and extensively fortified by the Dutch in the 17th century. Occupying 52 hectares at the southwestern tip of Sri Lanka, it is the largest remaining fortress in Asia built by a European colonial power and a UNESCO World Heritage Site since 1988. Inside the walls lie Dutch colonial buildings, mosques, churches, and boutique hotels.',
    openingHours: 'Fort always open; National Museum 9 AM – 6 PM (closed Mon)',
    entryFee: 'Free to enter the fort',
    rating: 4.7,
    tags: ['UNESCO', 'Dutch Colonial', 'Fort', 'Shopping'],
  },
  {
    name: 'Adam\'s Peak (Sri Pada)',
    category: 'Scenic',
    region: 'Sabaragamuwa Province',
    address: 'Nallatanniya, Maskeliya, Nuwara Eliya District, Sri Lanka',
    lat: 6.8096, lng: 80.4994,
    images: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=800&q=80',
    ],
    shortDescription: 'Sacred 2,243 m mountain with a night pilgrimage trail and breathtaking sunrise.',
    description: 'Sri Pada (Adam\'s Peak) is a 2,243 m tall conical mountain in central Sri Lanka, sacred to four religions. Buddhists venerate the rock formation near the summit as the footprint of the Buddha; Hindus as that of Shiva; Muslims and Christians as that of Adam. The pilgrimage trail from Nallatanniya involves over 5,500 steps, with pilgrims climbing overnight to witness the famous triangular shadow cast by the peak at sunrise.',
    openingHours: 'Pilgrimage season: December – May (trail open all night)',
    entryFee: 'Free',
    rating: 4.9,
    tags: ['Pilgrimage', 'Hiking', 'Sunrise', 'Sacred'],
  },
  {
    name: 'Horton Plains National Park',
    category: 'Scenic',
    region: 'Central Province',
    address: 'Horton Plains, Ohiya, Nuwara Eliya District, Central Province, Sri Lanka',
    lat: 6.8091, lng: 80.8074,
    images: [
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80',
    ],
    shortDescription: 'Misty plateau with World\'s End cliff dropping 870 m and rare cloud forest wildlife.',
    description: 'Horton Plains National Park sits at 2,100–2,300 m elevation in the central highlands of Sri Lanka. The park\'s most dramatic feature is World\'s End, a sheer escarpment with an 870 m drop offering views to the southern coast on clear mornings. The cloud forest is home to sambar deer, leopards, and the endemic purple-faced langur. Baker\'s Falls, a 20 m cascade, is a highlight of the circular 9.5 km hiking trail.',
    openingHours: '6:00 AM – 6:00 PM (best before 9 AM to avoid cloud cover)',
    entryFee: 'USD 25 per person',
    rating: 4.6,
    tags: ['Hiking', 'Wildlife', 'Cloud Forest', 'Waterfall'],
  },
]

const listings = [
  {
    listingType: 'hotel',
    name: 'Sigiriya Heritage Villa',
    region: 'Central',
    address: 'Sigiriya Village, Matale District, Central Province, Sri Lanka',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'A serene boutique hotel with stunning views of Sigiriya Rock, offering luxury rooms with private pools and traditional Sri Lankan hospitality.',
    price: { amount: 18500, unit: 'per_night', currency: 'LKR' },
    rating: 4.8, reviewCount: 124,
    options: { roomTypes: ['Deluxe Room', 'Pool Villa', 'Garden Suite'], amenities: ['Pool', 'Spa', 'Restaurant', 'Free WiFi', 'Airport Transfer'] },
  },
  {
    listingType: 'hotel',
    name: 'Kandy Lake View Resort',
    region: 'Kandy',
    address: 'Sangaraja Mawatha, Kandy 20000, Central Province, Sri Lanka',
    images: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1562778612-e1e0cda9915c?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Elegant colonial-style resort overlooking the scenic Kandy Lake, just minutes from the Temple of the Tooth Relic. Perfect blend of comfort and cultural immersion.',
    price: { amount: 12000, unit: 'per_night', currency: 'LKR' },
    rating: 4.6, reviewCount: 89,
    options: { roomTypes: ['Standard Room', 'Lake View Room', 'Executive Suite'], amenities: ['Rooftop Pool', 'Ayurveda Spa', 'Cultural Shows', 'Free WiFi'] },
  },
  {
    listingType: 'hotel',
    name: 'Ella Mountain Eco Lodge',
    region: 'Hill Country',
    address: 'Passara Road, Ella 90090, Badulla District, Uva Province, Sri Lanka',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1439130490301-25e322d88054?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Sustainable eco-lodge nestled in the misty hills of Ella, offering breathtaking views of the Nine Arch Bridge and surrounding tea plantations.',
    price: { amount: 8500, unit: 'per_night', currency: 'LKR' },
    rating: 4.7, reviewCount: 67,
    options: { roomTypes: ['Treehouse Cabin', 'Garden Bungalow', 'Panorama Suite'], amenities: ['Nature Walks', 'Tea Factory Tours', 'Organic Meals', 'Stargazing'] },
  },
  {
    listingType: 'tour',
    name: 'Cultural Triangle Grand Tour',
    region: 'Central',
    address: 'Departs from Colombo Fort, Colombo 01, Western Province, Sri Lanka',
    images: [
      'https://images.unsplash.com/photo-1588416936097-41850ab3d86d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1609803384069-19f3f41b5609?auto=format&fit=crop&w=800&q=80',
    ],
    description: '5-day immersive tour covering Sigiriya, Polonnaruwa, Dambulla Cave Temple, and Anuradhapura with expert guides and luxury transport.',
    price: { amount: 45000, unit: 'per_person', currency: 'LKR' },
    rating: 4.9, reviewCount: 203,
    options: { duration: '5 days / 4 nights', groupSize: 'Max 12 people', includes: ['Luxury AC Transport', 'Accommodation', 'All Entry Fees', 'English Guide', 'Breakfast & Dinner'] },
  },
  {
    listingType: 'tour',
    name: 'Southern Coast Wildlife Safari',
    region: 'Southern',
    address: 'Departs from Galle Fort, Galle 80000, Southern Province, Sri Lanka',
    images: [
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551085254-e96b210db58a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Thrilling 3-day safari experience at Yala National Park combined with beach relaxation at Mirissa and whale watching on the Indian Ocean.',
    price: { amount: 32000, unit: 'per_person', currency: 'LKR' },
    rating: 4.8, reviewCount: 156,
    options: { duration: '3 days / 2 nights', groupSize: 'Max 8 people', includes: ['Safari Jeep', 'Boutique Hotel', 'Whale Watch Boat', 'All Meals', 'Expert Naturalist'] },
  },
  {
    listingType: 'vehicle',
    name: 'Premium Land Cruiser (Self Drive)',
    region: 'Colombo',
    address: 'Bandaranaike International Airport, Katunayake, Western Province, Sri Lanka',
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Explore Sri Lanka at your own pace in a fully-serviced Toyota Land Cruiser. Perfect for adventurous travellers heading to national parks and hill country.',
    price: { amount: 9500, unit: 'per_day', currency: 'LKR' },
    rating: 4.5, reviewCount: 41,
    options: { seats: 7, transmission: 'Automatic', fuel: 'Petrol', extras: { driver: 3000, childSeat: 500, GPS: 0 }, includes: ['Insurance', 'Roadside Assistance', 'Full Tank'] },
  },
]

async function seed() {
  await mongoose.connect(MONGO_URI)
  console.log('Connected to MongoDB')

  // Clear all collections
  await Promise.all([
    User.deleteMany({}),
    Listing.deleteMany({}),
    Attraction.deleteMany({}),
    Booking.deleteMany({}),
  ])
  console.log('Cleared existing data')

  // Create admin user (User.create triggers pre-save bcrypt hook)
  const admin = await User.create({
    name: 'Lanka Explorer Admin',
    email: process.env.ADMIN_EMAIL || 'admin@lankaexplorer.lk',
    password: process.env.ADMIN_PASSWORD || 'admin123',
    role: 'admin',
  })

  // Create demo customer
  const customer = await User.create({
    name: 'Nimal Perera',
    email: 'nimal@example.com',
    password: 'demo1234',
    role: 'user',
  })

  console.log(`Created admin: ${admin.email}`)
  console.log(`Created demo user: ${customer.email} / demo1234`)

  // Seed attractions and listings
  const seededAttractions = await Attraction.insertMany(attractions)
  const seededListings = await Listing.insertMany(listings)
  console.log(`Seeded ${seededAttractions.length} attractions`)
  console.log(`Seeded ${seededListings.length} listings`)

  // Create demo bookings
  const hotelListing = seededListings.find(l => l.listingType === 'hotel')
  const tourListing  = seededListings.find(l => l.listingType === 'tour')

  await Booking.insertMany([
    {
      listingId: hotelListing._id,
      listingName: hotelListing.name,
      type: 'hotel',
      userId: customer._id,
      customer: { name: 'Nimal Perera', email: 'nimal@example.com', phone: '+94771234567' },
      details: { checkIn: '2026-07-10', checkOut: '2026-07-13', nights: 3, roomType: 'Pool Villa', guests: 2 },
      pricing: { unitPrice: hotelListing.price.amount, quantity: 3, extras: 0, total: hotelListing.price.amount * 3, currency: 'LKR' },
      status: 'confirmed',
      payment: { method: 'bank_transfer', reference: 'BT-2026-001', paidAmount: hotelListing.price.amount * 3, paidDate: '2026-06-01', payerName: 'Nimal Perera', submittedAt: new Date('2026-06-01') },
      history: [
        { actor: 'user',  action: 'created',        at: new Date('2026-06-01') },
        { actor: 'user',  action: 'submit_payment',  at: new Date('2026-06-01') },
        { actor: 'admin', action: 'confirm',         at: new Date('2026-06-02') },
      ],
    },
    {
      listingId: tourListing._id,
      listingName: tourListing.name,
      type: 'tour',
      userId: customer._id,
      customer: { name: 'Nimal Perera', email: 'nimal@example.com', phone: '+94771234567' },
      details: { tourDate: '2026-08-15', participants: 2, specialRequests: 'Vegetarian meals preferred' },
      pricing: { unitPrice: tourListing.price.amount, quantity: 2, extras: 0, total: tourListing.price.amount * 2, currency: 'LKR' },
      status: 'pending_payment',
      history: [
        { actor: 'user', action: 'created', at: new Date() },
      ],
    },
  ])
  console.log('Created 2 demo bookings')

  console.log('\n=== Seed complete ===')
  console.log('Admin login:     admin@lankaexplorer.lk / admin123')
  console.log('Customer login:  nimal@example.com / demo1234')
  await mongoose.disconnect()
}

seed().catch(err => { console.error(err); process.exit(1) })
