"use strict";

/**
 * offer router
 */

// @ts-ignore
const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::offer.offer", {
  config: {
    update: {
      policies: ["api::offer.is-authorized"],
    },
    delete: {
      policies: ["api::offer.is-authorized"],
    },
    // RMQ : dans ce cas on a appliqué la meme policy à deux routes differentes, car ces routes ont le meme comprtement :
    // Que ce soit delete ou update on envoie l'id de l'offre à supprimer/modifier en params
    // pour les deux on doit s'autenthifier avec le jwt

    // Bonus : Un utilisateur ne peut poster une offre que s'il en est le propriétaire
    // Pour cela, deux methodes :
    // 1- on peut modifier le comportement du controller de la route create (voir fichier ds controllers)
    // 2- on applique la policy a la route create aussi, en rajoutant une clé create dans l'objet config
    create: {
      policies: ["api::offer.is-authorized"],
    },
  },
});
