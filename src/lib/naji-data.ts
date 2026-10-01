export interface MenuItem {
  name: string;
  price: string;
  description: string;
  group: "Coffee" | "Signature" | "Matcha & Tea" | "Food & Bakery";
  image?: string;
  tag?: string;
}

export const featuredDrinks: MenuItem[] = [
  {
    name: "Iced Latte",
    price: "£4.75",
    description: "Espresso + cold milk",
    group: "Coffee",
  },
  {
    name: "Cappuccino",
    price: "£4.50",
    description: "Espresso + steamed milk + foam",
    group: "Coffee",
  },
  {
    name: "Matcha Latte",
    price: "£5.25",
    description: "Ceremonial matcha + steamed milk",
    group: "Matcha & Tea",
  },
  {
    name: "Cold Brew",
    price: "£4.25",
    description: "Smooth, bold, refreshing",
    group: "Coffee",
  },
];

export const drinks: MenuItem[] = [
  {
    name: "Iced Latte",
    price: "£4.75",
    description: "Double shot espresso over chilled milk and artisanal ice.",
    group: "Coffee",
    tag: "Popular",
  },
  {
    name: "Cappuccino",
    price: "£4.50",
    description: "Rich espresso topped with velvety microfoam and dusted cocoa.",
    group: "Coffee",
  },
  {
    name: "Cold Brew",
    price: "£4.25",
    description: "Steeped for 18 hours for maximum smoothness and zero bitterness.",
    group: "Coffee",
    tag: "Classic",
  },
  {
    name: "Espresso",
    price: "£3.50",
    description: "Double extraction of our single-origin house roast.",
    group: "Coffee",
  },
  {
    name: "Flat White",
    price: "£4.75",
    description: "Ristretto double shot with thin layer of steamed whole milk.",
    group: "Coffee",
  },
  {
    name: "Americano",
    price: "£3.75",
    description: "Espresso poured over hot or iced filtered mountain water.",
    group: "Coffee",
  },
  {
    name: "Pistachio Latte",
    price: "£5.75",
    description: "Handcrafted Sicilian pistachio butter, espresso, steamed oat milk.",
    group: "Signature",
    tag: "Signature",
  },
  {
    name: "Tangerine Mocha",
    price: "£5.50",
    description: "Belgian dark chocolate, fresh tangerine zest, and espresso.",
    group: "Signature",
  },
  {
    name: "Caramel Shakerato",
    price: "£5.00",
    description: "Shaken espresso, salted caramel, served chilled in a coupe glass.",
    group: "Signature",
  },
  {
    name: "Matcha Latte",
    price: "£5.25",
    description: "First-harvest ceremonial grade Uji matcha whisked with steamed milk.",
    group: "Matcha & Tea",
    tag: "Favorites",
  },
  {
    name: "Matcha Tonic",
    price: "£5.50",
    description: "Crisp botanical tonic water layered with vibrant ceremonial matcha.",
    group: "Matcha & Tea",
  },
  {
    name: "Earl Grey Reserve",
    price: "£4.00",
    description: "Organic black tea infused with Italian cold-pressed bergamot.",
    group: "Matcha & Tea",
  },
];

export const foods: MenuItem[] = [
  {
    name: "Avocado Sourdough Toast",
    price: "£9.50",
    description: "Fresh smashed avocado, microgreens, chili flakes on toasted artisan sourdough.",
    group: "Food & Bakery",
    tag: "Popular",
  },
  {
    name: "Almond Croissant",
    price: "£4.75",
    description: "Flaky all-butter croissant filled with sweet almond frangipane and toasted slices.",
    group: "Food & Bakery",
  },
  {
    name: "Tostada & Tomate",
    price: "£7.50",
    description: "Grated heirloom tomato, extra virgin olive oil, and flaky sea salt on sourdough.",
    group: "Food & Bakery",
  },
  {
    name: "Lemon Poppyseed Loaf",
    price: "£4.25",
    description: "Moist Meyer lemon cake with organic poppyseeds and a crisp citrus glaze.",
    group: "Food & Bakery",
  },
  {
    name: "Basque Burnt Cheesecake",
    price: "£6.50",
    description: "Caramelized crust with an ultra-creamy, melt-in-your-mouth center.",
    group: "Food & Bakery",
    tag: "House Special",
  },
  {
    name: "Seasonal Fruit Brioche",
    price: "£5.25",
    description: "Toasted brioche, whipped ricotta, local honey, and seasonal macerated berries.",
    group: "Food & Bakery",
  },
];

export const cafeName = "Cafe Parisienne";
export const address = "225 Lavender Hill, London SW11 1JR, United Kingdom";
export const plusCode = "FR7Q+P5 London, United Kingdom";
export const phone = "+44 20 7924 5523";
export const phoneHref = "tel:+442079245523";
export const whatsappUrl = "https://wa.me/442079245523?text=Hello";
export const priceRange = "£10–20 per person";
export const email = "hello@cafeparisienne.co.uk";
export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;

export const openingHours = [
  { day: "Sunday", hours: "7:00 am – 3:30 pm" },
  { day: "Monday", hours: "6:30 am – 3:30 pm" },
  { day: "Tuesday", hours: "6:30 am – 3:30 pm" },
  { day: "Wednesday", hours: "6:30 am – 3:30 pm" },
  { day: "Thursday", hours: "6:30 am – 3:30 pm" },
  { day: "Friday", hours: "6:30 am – 3:30 pm" },
  { day: "Saturday", hours: "6:30 am – 3:30 pm" },
] as const;