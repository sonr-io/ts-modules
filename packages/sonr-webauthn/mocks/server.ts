const path = require("path");
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, ".env") });

import express, { Request, Response, RequestHandler } from 'express';
import session from 'express-session';
import useragent from 'express-useragent';
import { engine } from 'express-handlebars';

import helmet from 'helmet';

import { webauthn } from './webauthn';

const views = path.join(__dirname, 'templates');
const app = express();
app.set('view engine', 'html');
app.engine('html', engine({
  extname: 'html',
}));
app.set('views', views);
app.use(express.static(path.join(__dirname, 'templates')));
app.use(express.json() as RequestHandler);
app.use(useragent.express());

let session_name;
if (process.env.NODE_ENV === 'localhost') {
  session_name = process.env.SESSION_STORE_NAME || 'session';
} else {
  session_name = `__Host-${process.env.SESSION_STORE_NAME || 'session'}`;
}

// TODO: The session seems to live very short.
app.use(session({
  name: session_name,
  secret: process.env.SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
  proxy: true,
  session: {},
  cookie: {
    secure: process.env.NODE_ENV !== 'localhost',
    path: '/',
    sameSite: 'strict',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
  }
}));

// Run helmet only when it's running on a remote server.
if (process.env.NODE_ENV !== 'localhost') {
  app.use(helmet.hsts());
}

app.use((req, res, next) => {
  res.locals.hostname = req.hostname;
  const protocol = process.env.NODE_ENV === 'localhost' ? 'http' : 'https';
  res.locals.origin = `${protocol}://${req.headers.host}`;
  res.locals.title = process.env.PROJECT_NAME;
  next();
});

app.get('/', (req: Request, res: Response) => {
  res.render('index.html');
});

// listen for requests :)
app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});

app.use('/webauthn', webauthn);