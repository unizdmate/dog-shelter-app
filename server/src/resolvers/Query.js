const { forwardTo } = require("prisma-binding");
const { hasPermission } = require("../utils");

const Query = {
  dogs: forwardTo("db"),
  dog: forwardTo("db"),
  dogsConnection: forwardTo("db"),
  currentUser(parent, args, ctx, info) {
    //Provjeriti postoji li current user
    if (!ctx.request.userId) {
      //Ne bacamo grešku jer korisnik možda postoji ali nije logiran => null
      return null;
    }
    return ctx.db.query.user(
      {
        where: { id: ctx.request.userId },
      },
      info
    );
  },
  async users(parent, args, ctx, info) {
    //je li korisnik logiran
    if (!ctx.request.userId) {
      throw new Error("Morate biti prijavljeni");
    }
    //ima li current user dopuštenje izlistati sve korisnike
    hasPermission(ctx.request.user, ["ADMIN", "PERMISSIONUPDATE"]);
    //ako ima, izlistaj sve korisnike
    return ctx.db.query.users({}, info);
  },

  async adoptions(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error("Morate biti prijavljeni");
    }
    if (!ctx.request.userId) {
      throw new Error("Morate biti prijavljeni");
    }
    return ctx.db.query.adoptedDogs({}, info);
  },

  async friends(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error("Morate biti prijavljeni");
    }
    if (!ctx.request.userId) {
      throw new Error("Morate biti prijavljeni");
    }
    return ctx.db.query.friendedDogs({}, info);
  },
};

module.exports = Query;
