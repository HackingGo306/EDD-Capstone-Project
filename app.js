const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const crypto = require("node:crypto");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const next = require("next");

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: ".env.development" });
}

//redis

const { RedisStore } = require("connect-redis");
const redisClient = require("./model/redis");
const redisStore = new RedisStore({
  client: redisClient,
  ttl: 60 * 60 * 24 * 3,
});

const sessionMiddleWare = session({
  store: redisStore,
  secret: process.env.SECRET_ID,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    signed: true,
    sameSite: "none",
  },
});

module.exports = { server, sessionMiddleWare };

//API

// const authAPI = require("./api/auth").Router;
// const userAPI = require('./api/user').Router;
// const aiAPI = require('./api/ai').Router;

//middlewares

//cors
app.use(
  cors({
    origin: process.env.SERVER_CORS.split(", "),
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS", "HEAD"],
    credentials: true,
  })
);

//helmet for cyber security
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
//app.use(helmet.contentSecurityPolicy());
app.use(helmet.dnsPrefetchControl());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use((req, res, next) => {
  res.locals.cspNonce = crypto.randomBytes(16).toString("hex");
  res.setHeader("X-XSS-protection", "1; mode=block");
  //console.log(res.locals.cspNonce)
  next();
});
app.use(helmet.frameguard({ action: "SAMEORIGIN" }));
const cspOptions = {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    frameSrc: ["'self'"],
  },
};
app.use(helmet.contentSecurityPolicy(cspOptions));

//body parser
app.use(bodyParser.json());

//cookie parser
app.use(cookieParser(process.env.SECRET_ID));

app.use(sessionMiddleWare);

//api
// app.use("/auth", authAPI);
// app.use('/user', userAPI);
// app.use('/ai', aiAPI);

app.head("/", (req, res) => {
  res.status(200).end();
});

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const PORT = process.env.PORT || 5000;
const HOST = process.env.NODE_ENV === "development" ? "localhost" : undefined;

nextApp.prepare().then(() => {
  app.use((req, res) => {
    return handle(req, res);
  });

  server.listen(PORT, HOST, () => {
    if (HOST) {
      console.log(`Server running at http://${HOST}:${PORT}`);
    } else {
      console.log(`Server running on port ${PORT}`);
    }
  });
});