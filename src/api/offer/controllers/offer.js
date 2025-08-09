"use strict";

/**
 * offer controller
 */

// @ts-ignore
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::offer.offer",
  // on veut etendre le comportement du controller de la nouvelle route delete-all que l'on a crée :
  // en 2eme arg on rajoute une fonction qui destructure la clé strapi de l'objet qu'elle reçoit en argument et qui renvoi un objet
  ({ strapi }) => ({
    async deleteAll(ctx) {
      // delete all est en fait une clé de l'objet retourné
      try {
        // recupérer les données du  user qui fait la requete , qui se trouvent dans ctx.state.user
        // console.log(ctx.state.user);
        // On veut l'id de cet user :
        const userId = ctx.state.user.id;
        // on utilise l'entityservice API de Strapi pour recupérer dans la BDD (dans la collection user)  les infos de l'utilisateur ayant cette id :
        const user = await strapi.entityService.findOne(
          "plugin::users-permissions.user",
          userId,
          // on rajoute un 3eme argument pour déployer la clé offers (et ainsi recuperer les references vers les offres qu'il a posté)
          { populate: ["offers"] }
        );
        console.log(user); // renvoi les infos de l'user contenant une clé "offers" qui renvoi un tableau d'objets avec toutes les offres qu'il a posté et leurs infos

        // On doit maintenant parcourir le tableau de références (=d'offres) avec une boucle :
        for (let i = 0; i < user.offers.length; i++) {
          console.log(user.offers[i]); // affiche les offres et leurs infos
          // Pour supprimer chacune d'entre elles grâce à la méthode delete de l'Entity Service API de Strapi,
          // il nous faut leur id (car c'est le 2eme arg)
          const offer = user.offers[i];
          await strapi.entityService.delete("api::offer.offer", offer.id);
        }
        return { message: "all offers deleted" };
      } catch (error) {
        ctx.response.status = 500;
        return { message: error.message };
      }
    },

    // Bonus : Un utilisateur ne peut poster une offre que s'il en est le propriétaire
    // methode 1 : etendre le comportement du controller

    // pour moifier le controlller de la route create aussi, il suffit de rajouter une clé create, de même que nous avons ajouté la clé deleteAll

    // async create(ctx) {
    //   try {
    //     //console.log(ctx.state.user); // affiche les données de l'utilsateur qui fait la requete
    //     // on recupère l'id :
    //     const requesterId = ctx.state.user.id;
    //     //console.log(requesterId);

    //     // on doit maintenant verifier que cet id est le même que celui envoyé dans le body de la requete (clé owner) lors de la creation de l'offre.
    //     // cet id se trouve donc dans ctx.request.body
    //     // console.log(ctx.request.body) // : renvoi un objet avec une clé data (mais celle ci ne contient pas un objet mais une string!!!)
    //     // console.log(typeof ctx.request.body.data); // renvoi "string"
    //     // l'id devrai normalement se trouver dans la clé owner de l'objet contenu dans data, cad  dans : ctx.request.body.data.owner mais comme c est une string ca ne fonctionnera pas  :
    //     // console.log(ctx.request.body.data.owner); // Ceci renvoi donc undefined ds le terminal
    //     // Pourquoi? (cf p26 des cours sem3)
    //     // car la requete a été envoyée avec un form data donc les données de la ligne data c'est a dire l'objet envoyé contenant les paires clé-valeurs a ete transformé en une string automatiquement
    //     // donc ctx.request.body.data est en fait une string, c est pour ça que console.log (ctx.request.body.data.owner)  renvoie undefined!
    //     // pour recupérer des données de cette string ,
    //     // il faut la "parser" : càd le retransformé en objet a l'aide la methode JSON.parse()
    //     const parsedBody = JSON.parse(ctx.request.body.data);
    //     console.log(parsedBody); // renvoi cet fois un objet avec toutes les paires clés valeurs de la ligne data du form data
    //     // console.log(typeof parsedBody); // renvoi "object"
    //     // maintenant on peut recupérer l'id contenue dans la clé owner :
    //     const ownerId = parsedBody.owner;
    //     // si les id sont differentes ont doit d'apres les consignes de l'exercice renvoyer un status 403
    //     if (requesterId !== ownerId) {
    //       ctx.response.status = 403;
    //       // on renvoie en plus un message
    //       return { message: "you must be the offer's owner" };
    //       // si non , on veut le comportement normal de la route : Pour cela on utilise la variable SUPER (p.27 cours sem2)
    //     } else {
    //       // await super.create(ctx); // ceci renvoi un objet dont on doit destructurer les clé data et meta
    //       const { data, meta } = await super.create(ctx);
    //       return { data, meta };
    //       // ces deux dernieres lignes je ne comprends pas mais je fais ce qu'il dit LOL
    //     }
    //   } catch (error) {
    //     ctx.response.status = 500;
    //     return { message: error.message };
    //   }
    // },
  })
);
