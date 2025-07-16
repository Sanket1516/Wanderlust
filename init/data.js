const sampleListings = [
  {
    title: "Luxury Jungle Treehouse",
    description: "Live among the treetops in this luxurious treehouse surrounded by tropical rainforest.",
    image: "https://plus.unsplash.com/premium_photo-1697730133511-31d978a0e8a0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8dHJlZSUyMGhvdXNlJTIwYmFsaXxlbnwwfHwwfHx8MA%3D%3D",
    price: 2200,
    location: "Bali",
    country: "Indonesia"
  },
  {
    title: "Chic Paris Loft",
    description: "Charming and modern loft in the heart of Paris, steps away from the Eiffel Tower.",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=M3w",
    price: 2500,
    location: "Paris",
    country: "France"
  },
  {
    title: "Desert Glamping Tent",
    description: "A unique desert experience in a luxury tent under the stars, complete with amenities.",
    image: "https://images.unsplash.com/photo-1640755668096-4f4c7b8f4410?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: 900,
    location: "Wadi Rum",
    country: "Jordan"
  },
  {
    title: "Nordic Glass Igloo",
    description: "Sleep under the Northern Lights in a cozy glass igloo with panoramic Arctic views.",
    image: "https://images.unsplash.com/photo-1634662593278-11d75aacab28?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: 2700,
    location: "Rovaniemi",
    country: "Finland"
  },
  {
    title: "Santorini Cliffside Home",
    description: "Whitewashed cliffside home with breathtaking views of the Aegean Sea and blue domes.",
    image: "https://images.unsplash.com/photo-1705860007370-ddc843fc4ad5?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: 3000,
    location: "Santorini",
    country: "Greece"
  },
  {
    title: "Coastal Surf Shack",
    description: "Relax in a boho surf shack just steps away from the beach, perfect for surfers and sun lovers.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3w",
    price: 800,
    location: "Byron Bay",
    country: "Australia"
  },
  {
    title: "Tokyo Micro Apartment",
    description: "A compact and futuristic apartment in downtown Tokyo, ideal for solo travelers.",
    image: "https://images.unsplash.com/photo-1734667434795-b760235451dc?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: 950,
    location: "Tokyo",
    country: "Japan"
  },
  {
    title: "Classic London Flat",
    description: "Stay in a traditional brick flat with modern interiors, located near Hyde Park.",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&ixid=M3w",
    price: 2100,
    location: "London",
    country: "United Kingdom"
  },
  {
    title: "Cape Town Hilltop Villa",
    description: "Modern villa overlooking the ocean and Table Mountain, complete with infinity pool.",
    image: "https://images.unsplash.com/photo-1664362657309-7dd53ca62b7e?q=80&w=1081&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: 2600,
    location: "Cape Town",
    country: "South Africa"
  },
  {
    title: "Swiss Alps Chalet",
    description: "A wooden chalet with fireplace, nestled in the snowy Swiss Alps. Great for skiing.",
    image: "https://images.unsplash.com/photo-1633341500706-62690376b1ec?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: 2300,
    location: "Zermatt",
    country: "Switzerland"
  },
   {
    title: "Cozy Beachfront Cottage",
    description: "Escape to this charming beachfront cottage for a relaxing getaway. Enjoy stunning sunsets and ocean breezes.",
    image: "https://plus.unsplash.com/premium_photo-1682285210821-5d1b5a406b97?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: 1500,
    location: "Malibu",
    country: "United States"
  },
  {
    title: "Modern City Apartment",
    description: "Experience luxury living in this stylish city apartment located in the heart of downtown.",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3w",
    price: 2000,
    location: "New York",
    country: "United States"
  },
  {
    title: "Rustic Mountain Cabin",
    description: "Unplug and unwind in this cozy cabin nestled in the scenic mountains. Perfect for a nature escape.",
    image: "https://images.unsplash.com/photo-1561637270-132c4c64c8dc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8UnVzdGljJTIwTW91bnRhaW4lMjBDYWJpbnxlbnwwfHwwfHx8MA%3D%3D",
    price: 1200,
    location: "Aspen",
    country: "United States"
  },
  {
    title: "Charming Countryside Villa",
    description: "Relax in this beautiful villa surrounded by rolling hills and vineyards. A true countryside retreat.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3w",
    price: 1800,
    location: "Tuscany",
    country: "Italy"
  },
  {
    title: "Lakeside A-Frame Cabin",
    description: "Stay in a stylish A-frame cabin with serene lake views, perfect for a peaceful weekend getaway.",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=M3w",
    price: 1000,
    location: "Lake Tahoe",
    country: "United States"
  }
];

module.exports = sampleListings;