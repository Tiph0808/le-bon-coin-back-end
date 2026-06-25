// @ts-nocheck
// Cette policy verifie que l'utilisateur connecté est bien le owner de l'offre concernée ( l' offre que l'on veut creer, effacer, oou modifier par exemple).
// Elle est appliquée aux routes create, update et delete (voir fichier collection offer->route->offerjs)
// pour les cas des routes delete et update elle reçoit l'id de l'offre en params, elle va recuperer l'id de l'owner de cette offre et le compare avec celui qui fait la requete ( cad de l'utilisateur connecté)
// pour le cas de la route create, elle ne reçoit pas d'id d'offre en params mais un owner est renseigné dans le formdata envoyé pour créer l'annonce, elle le recupère et vérifie si cest le meme id que l'utilisateur connecté (pour eviter qu'un utilisateur crée une offre et l'attribue a qqn d'autre)

// Dans tous les cas, si ce n'est pas le meme utilisateur --> requete bloquee (return false)
// si non la requete passe (return true)

module.exports = async (policyContext, config, { strapi }) => {
  // (on a rajouté async devant car plus bas nous allons faire des requetes a l'ESA de strapi)
  // Pour recuperer l'id de l utilisateur qui fait la requete : ctx.state.user, ATTENTION!!! IMPORTANT!! : ici les infos concernant la requête se trouvent dans policyContext, et non ctx ! ;)
  // console.log(policyContext.state.user);
  const requesterId = policyContext.state.user.id;
  console.log(requesterId);

  if (policyContext.request.params.id) {
    // = "si il ya des params envoyés dans la requete alors on applique cette policy" ( exemple : les routes delete et update envoies une id en params)

    // on recupère l'id de l'offre qui a été envoyée en params qui se trouve dans ctx.request.params (ici ctx=policyContext) :
    // console.log(policyContext.request.params);
    const offerId = policyContext.request.params.id;
    console.log(offerId);

    // recuperer l'offre grace a son id avec l'ESA de Strapi
    const offer = await strapi.entityService.findOne(
      "api::offer.offer",
      offerId,
      // on populate la clé owner car on veut savoir qui a posté cette offre initialement
      { populate: ["owner"] }
    );
    console.log(offer);
    // l'id de celui qui a posté l'offre se trouve dans offer.owner.id
    // in compare cette id avec le requester id ( = l'id de l'utilisateur connecté, celui qui fait la requete)
    if (requesterId === offer.owner.id) {
      return true; // si c'est bon on laisse passer la requête
    } else {
      return false; // sinon non
    }
    //
    //
    //  sinon (si pas de params dans la requete, comme pour la route create, qui n'a pas de params)
  } else {
    // pour la route create qui n'envoie pas d'id en params
    // on va chercher l'id de celui qui fait la requete dans le body de celle ci
    console.log(policyContext.request.body);
    // Attention!!! on  ooublie pas que l'on  envoyé les donnees de l'offre avec un form data!
    // par consequent ce console.log ceci renvoie un objet avec une clé data qui contient une string, qu 'il faut "destringifier" pour acceder a la clé owner!
    // on dit aussi "parser" cette string pour la retransformer en objet
    const ownerId = JSON.parse(policyContext.request.body.data).owner;
    console.log(ownerId);
    // "si l'owner id renseigné lors de la creation de sl'annonce est different de celui de l'utilisateur connecté" :
    if (requesterId !== ownerId) {
      return false;
    } else {
      return true;
    }
  }
};
