module.exports = {
  routes: [
    {
      // on crée une nouvelle route pour que l'utilisateur puisse effacer toutes ces ofres d'un coup
      method: "DELETE",
      path: "/offers/delete-all",
      handler: "offer.deleteAll",
    },
  ],
};
