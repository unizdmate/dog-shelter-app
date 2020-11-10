const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomBytes } = require("crypto");
const { promisify } = require("util");
const { transport, emailTemplate } = require("../mail");
const { hasPermission } = require("../utils");

const Mutations = {
  async createDog(parent, args, ctx, info) {
    // Provjera je li korisnik prijavljen
    if (!ctx.request.userId) {
      throw new Error("Nemate ovlasti za ovu radnju");
    }
    const dog = await ctx.db.mutation.createDog(
      {
        data: {
          //Stvaranje relacije između psa i korisnika
          user: {
            connect: {
              id: ctx.request.userId,
            },
          },
          ...args,
        },
      },
      info
    );
    return dog;
  },

  updateDog(parent, args, ctx, info) {
    //izvuci kopiju updatea
    const updates = { ...args };
    //ukloniti ID da ne updatem i njega
    delete updates.id;
    //pokrenuti update funkciju
    return ctx.db.mutation.updateDog(
      {
        data: updates,
        where: {
          id: args.id,
        },
      },
      info
    );
  },

  async deleteDog(parent, args, ctx, info) {
    const where = { id: args.id };
    //pronaći objekt tipa pas
    const dog = await ctx.db.query.dog({ where }, `{id, name}`);

    //izbrisati objekt
    return ctx.db.mutation.deleteDog({ where }, info);
  },

  async signup(parent, args, ctx, info) {
    //Spriječiti neuspješan signup zbog velikog ili malog slova
    args.email = args.email.toLowerCase();

    //Hashiranje passworda ==> drugi argument garantira jedinstvenost hasha
    const password = await bcrypt.hash(args.password, 12);

    //Kreiranje korisnika u db
    const user = await ctx.db.mutation.createUser(
      //Spread cijelog args objekta da se izvuku potrebni podaci, ali override passoda da se osigura hashirana verzija
      {
        data: {
          ...args,
          password,
          permissions: { set: ["USER"] },
        },
      },
      info
    );
    //Kreiranje JWT tokena
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    //Postaviti JET kao cookie na odgovoru servera
    ctx.response.cookie("token", token, {
      httpOnly: true,
      //Postaviti trajanje na godinu dana
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });
    //Vratiti objekt tipa User
    return user;
  },

  //Destruktuirati args objekt u email i password da ne moramo pozivati args.email i args.password
  async signin(parent, { email, password }, ctx, info) {
    //Provjeriti postoji li traženi user
    const user = await ctx.db.query.user({ where: { email: email } });
    if (!user) {
      throw new Error(`Ne postoji korisnik s e-mail adresom ${email}`);
    }
    //Provjeriti odgovara li password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new Error("Neispravna lozinka");
    }
    //Generirati JWT token
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    //Postaviti cookie pomoću tokena
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });
    //Vratiti objekt tipa user
    return user;
  },

  signout(parent, args, ctx, info) {
    ctx.response.clearCookie("token");
    return { message: "Uspješna odjava" };
  },

  async resetRequest(parent, args, ctx, info) {
    //Provjeriti je li pravi korisnik
    const user = await ctx.db.query.user({ where: { email: args.email } });
    if (!user) {
      throw new Error(`Ne postoji korisnik s e-mail adresom ${args.email}`);
    }
    //Postaviti reset token s kraćim rokom trajanja
    const resetToken = (await promisify(randomBytes)(20)).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; //1 sat pretvoren u milisekunde
    const response = await ctx.db.mutation.updateUser({
      where: { email: args.email },
      data: { resetToken, resetTokenExpiry },
    });

    //Poslati email
    const mailResponse = await transport.sendMail({
      from: "admin@dog-shelter.zd",
      to: user.email,
      subject: "Zahtjev za novom lozinkom | Azil Zadar",
      html: emailTemplate(
        `Zatražili ste promjenu lozinke.
        \n\n
        <a href="${process.env.FRONTEND_URL}/resetpage?resetToken=${resetToken}">Klikni ovdje za postavljanje nove lozinke</a>`
      ),
    });
    //Vratiti poruku
    return { message: "Uspješno" };
  },

  async resetPassword(parent, args, ctx, info) {
    //Provjeriti slažu li se lozinke
    if (args.password !== args.confirmPassword) {
      throw new Error("Lozinke se ne podudaraju");
    }
    //Provjeriti reset token i je li reset token istekao
    //Dohvaćam array tipa user uz query "users" jer ako pozovem query "user" i vratim samo jednog korisnika, mogu raditi samo s id i email (jedini su unique)
    //Iz arraya izvlačim prvog (i jedinog) usera koji ima navedeni resetToken i resetTokenExpiry
    const [user] = await ctx.db.query.users({
      where: {
        resetToken: args.resetToken,
        resetTokenExpiry_gte: Date.now() - 3600000,
      },
    });
    if (!user) {
      throw new Error("Neispravan token, pokušajte ponovo");
    }
    //Hashirati novu lozinku
    const password = await bcrypt.hash(args.password, 12);
    //Sačuvati novu lozinku u polju "password" kod Usera
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { email: user.email },
      data: {
        password,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
    //Generirati JWT
    const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);
    //Dodati JWT cookie
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });
    //Vratiti korisnika s apdejatnim podatkom password
    return updatedUser;
  },

  updateUser(parent, args, ctx, info) {
    //izvuci kopiju updatea
    const updates = { ...args };
    //ukloniti ID da ne updatem i njega
    delete updates.id;
    //pokrenuti update funkciju
    return ctx.db.mutation.updateUser(
      {
        data: updates,
        where: {
          id: args.id,
        },
      },
      info
    );
  },

  async deleteUser(parent, args, ctx, info) {
    const where = { id: args.id };
    //pronaći objekt tipa korisnik
    const user = await ctx.db.query.user({ where }, `{id, name}`);

    //izbrisati objekt
    return ctx.db.mutation.deleteUser({ where }, info);
  },

  async updatePermissions(parent, args, ctx, info) {
    //Provjeriti je li logiran
    if (!ctx.request.userId) {
      throw new Error("Morate biti prijavljeni");
    }
    //Dohvatiti trenutnog korisnika
    const currentUser = await ctx.db.query.user(
      { where: { id: ctx.request.userId } },
      info
    );
    //Provjeriti ima li razinu autorizacije
    hasPermission(currentUser, ["ADMIN", "PERMISSIONUPDATE"]);
    //Update razine autorizacije za izabranog korisnika
    return ctx.db.mutation.updateUser(
      {
        data: {
          permissions: {
            set: args.permissions,
          },
        },
        where: { id: args.userId },
      },
      info
    );
  },

  async adopt(parent, args, ctx, info) {
    const adoptedDog = await ctx.db.mutation.createAdoptedDog(
      {
        data: {
          user: {
            connect: {
              id: ctx.request.userId,
            },
          },
          ...args,
        },
      },
      info
    );

    const mailResponseForAdmin = await transport.sendMail({
      from: args.userEmail,
      to: "admin@dog-shelter.zd",
      subject: `${args.dogName} - Zahtjev za udomljenjem`,
      html: emailTemplate(
        `<p>Korisnik ${args.userName} poslao je zahtjev za udomljenjem.</p>

        <p>Korisnikovi kontakt podaci u nastavku:</p>
        
        <p>Ime: ${args.userName}</p>
        
        <p>E-mail adresa: ${args.userEmail}</p>
        
        <p>Kontakt broj: ${args.userPhoneNo}</p>
        
        <p>Adresa: ${args.userAddress}, ${args.userAreaCode} ${args.userCity}</p>

        <p>Molimo da ga kontaktirate u najkraćem mogućem roku.</p>

        <img src="${args.dogImage}" style="width:50%;"/>
        `
      ),
    });

    const mailResponseForUser = await transport.sendMail({
      from: "admin@dog-shelter.zd",
      to: args.userEmail,
      subject: `${args.dogName} - Zahtjev za udomljenjem`,
      html: emailTemplate(
        `<p>${args.dogName} ti se zahvaljuje što ga želiš udomiti!</p>

        <p>Naši volonteri će te u najkraćem roku kontaktirati na: ${args.userPhoneNo}</p>
        
        <img src="${args.dogImage}" style="width:50%;"/>
        `
      ),
    });
    return adoptedDog;
  },

  async becomeFriend(parent, args, ctx, info) {
    const friendedDog = await ctx.db.mutation.createFriendedDog(
      {
        data: {
          user: {
            connect: {
              id: ctx.request.userId,
            },
          },
          ...args,
        },
      },
      info
    );

    const mailResponseForAdmin = await transport.sendMail({
      from: args.userEmail,
      to: "admin@dog-shelter.zd",
      subject: `${args.dogName} - Zahtjev za prijateljstvom`,
      html: emailTemplate(
        `<p>Korisnik ${args.userName} poslao je zahtjev za prijateljstvom.</p>

        <p>Korisnikovi kontakt podaci u nastavku:</p>
        
        <p>Ime: ${args.userName}</p>
        
        <p>E-mail adresa: ${args.userEmail}</p>
        
        <p>Kontakt broj: ${args.userPhoneNo}</p>
        
        <p>Molimo da ga kontaktirate u najkraćem mogućem roku.</p>

        <img src="${args.dogImage}" style="width:50%;"/>
        `
      ),
    });

    const mailResponseForUser = await transport.sendMail({
      from: "admin@dog-shelter.zd",
      to: args.userEmail,
      subject: `${args.dogName} - Zahtjev za prijateljstvom`,
      html: emailTemplate(
        `<p>${args.dogName} ti se zahvaljuje što mu želiš biti prijatelj!</p>

        <p>Naši volonteri će te u najkraćem roku kontaktirati na: ${args.userPhoneNo}</p>
        
        <img src="${args.dogImage}" style="width:50%;"/>
        `
      ),
    });
    return friendedDog;
  },
};

module.exports = Mutations;
