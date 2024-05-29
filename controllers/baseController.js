import utils from "../utils/index.js";

const buildHome = async (req, res) => {
  const navData = await utils.getNavData();
  res.render("pages/home", {
    title: "Home",
    vehicle,
    navData,
  });
};

export default { buildHome };

const vehicle = {
  id: "delorean",
  make: "DMC",
  model: "Delorean",
  image: "/images/vehicles/delorean.jpg",
  image_tn: "/images/vehicles/delorean-tn.jpg",
  features: ["3 Cup holders", "Superman doors", "Fuzzy dice!"],
  upgrades: [
    {
      name: "Flux Compensator",
      image: "/images/upgrades/flux-cap.png",
      path: "#",
    },
    { name: "Flame Decals", image: "/images/upgrades/flame.jpg" },
    {
      name: "Bumper Stickers",
      image: "/images/upgrades/bumper_sticker.jpg",
      path: "#",
    },
    {
      name: "Hub Caps",
      image: "/images/upgrades/hub-cap.jpg",
      path: "#",
    },
  ],
  reviews: [
    {
      id: 1,
      content: "So fast it's almost like traveling in time.",
      rating: 4,
    },
    {
      id: 2,
      content: "Coolest ride on the road.",
      rating: 4,
    },
    {
      id: 3,
      content: "I'm feeling McFly!",
      rating: 5,
    },
    {
      id: 4,
      content: "The most futuristic ride of our day.",
      rating: 4.5,
    },
    {
      id: 5,
      content: "80's livin and I love it!",
      rating: 5,
    },
  ],
};
