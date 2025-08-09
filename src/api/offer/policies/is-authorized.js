module.exports = async (policyContext, config, { strapi }) => {
  // (on a rajouté async devant car plus bas nous allons faire des requetes a l'ESA de strapi)
  // Pour recuperer l'id de l utilisateur qui fait la requete : ctx.state.user, ATTENTION!!! IMPORTANT!! : ici les infos concernant la requête se trouvent dans policyContext, et non ctx ! ;)
  // console.log(policyContext.state.user);
  const requesterId = policyContext.state.user.id;
  console.log(requesterId);

  if (policyContext.request.params.id) {
    // = "si il ya des params envoyés dans la requete alors on applique cette policy"
    // ( de cette facon on pourra aussi appliquer cette policy a d'autre routes qui n'envoi, pas forcément
    // de params)
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
    // in compare cette idd avec le requester id
    if (requesterId === offer.owner.id) {
      return true; // si c'est bon on laisse passer la requête
    } else {
      return false; // sinon non
    }
    //
    //
    //  sinon (si pas de params dans la requete)
  } else {
    // on va chercher l'id de celui qui fait la requete dans le body de celle ci
    console.log(policyContext.request.body);
    // Attention!!! on  ooublie pas que l'on  envoyé les donnees de l'offre avec un form data!
    // par consequent ce console.log ceci renvoie un objet avec une clé data qui contient une string, qu 'il faut "destringifier" pour acceder a la clé owner!
    // on dit aussi "parser" cette string pour la retransformer en objet
    const ownerId = JSON.parse(policyContext.request.body.data).owner;
    console.log(ownerId);
    if (requesterId !== ownerId) {
      return false;
    } else {
      return true;
    }
  }
};
