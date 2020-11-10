require("dotenv").config({ path: "variables.env" });
const createServer = require("./createServer");
const db = require("./db");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { request } = require("./db");

const server = createServer();

// Napraviti Express middleware za hendlanje cookieja(JWT)
server.express.use(cookieParser());

// Napraviti Express middleware za puniti current usera
//Dekodiranje JWT tokena za dohvatiti user id na svakom requestu

server.express.use((req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_Secret);
    //Dodajemo userId na request za svaki budući req
    req.userId = userId;
  }
  next();
});

//napraviti middleware za puniti listu usera za svaki request
server.express.use(async (req, res, next) => {
  //Ako nije prijavljen => preskoči
  if (!req.userId) return next();
  const user = await db.query.user(
    { where: { id: req.userId } },
    `{ id, permissions, email, name }`
  );
  req.user = user;
  next();
});

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL,
    },
  },
  (details) => {
    console.log(`Server is now running on port ${details.port}`);
  }
);
