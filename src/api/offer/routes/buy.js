module.exports = {
  routes: [
    {
      // Je crée une nouvelle route custom pour acheter
      method: "POST",
      path: "/offers/buy",
      handler: "offer.buy",
    },
  ],
};
