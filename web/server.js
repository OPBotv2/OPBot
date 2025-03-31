// ─────────────────────────────────────────────
// 📦 Imports & Setup
// ─────────────────────────────────────────────
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const path = require('path');
const dashboardRoutes = require('./routes/dashboard');
const settingsApi = require('./routes/api/settings');

const app = express();
const PORT = process.env.DASHBOARD_PORT || 3000;

// ─────────────────────────────────────────────
// 🛠️ Middleware
// ─────────────────────────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Nur bei HTTPS
    maxAge: 1000 * 60 * 60 * 2 // 2h
  }
}));

// ─────────────────────────────────────────────
// 🔐 Passport Auth
// ─────────────────────────────────────────────
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.use(new DiscordStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: `${process.env.DASHBOARD_URL}/auth/discord/callback`,
  scope: ['identify', 'guilds']
}, (accessToken, refreshToken, profile, done) => {
  process.nextTick(() => done(null, profile));
}));

app.use(passport.initialize());
app.use(passport.session());

// ─────────────────────────────────────────────
// 🔗 Auth Routes
// ─────────────────────────────────────────────
app.get('/auth/discord', passport.authenticate('discord'));
app.get('/auth/discord/callback', passport.authenticate('discord', {
  failureRedirect: '/'
}), (req, res) => res.redirect('/dashboard'));

app.get('/logout', (req, res) => {
  req.logout(() => res.redirect('/'));
});

// ─────────────────────────────────────────────
// 🔒 Auth Middleware
// ─────────────────────────────────────────────
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/auth/discord');
}

// ─────────────────────────────────────────────
// 📁 Routes
// ─────────────────────────────────────────────
app.use('/dashboard', isAuthenticated, dashboardRoutes);
app.use('/api/settings', isAuthenticated, settingsApi);

// Home
app.get('/', (req, res) => {
  res.render('home', { user: req.user });
});

// 🔍 Debug
app.get('/debug', (req, res) => {
  res.json({
    authenticated: req.isAuthenticated(),
    user: req.user || null
  });
});

// 🟢 Status
app.get('/status', (req, res) => {
  const client = app.locals.client;
  if (!client) return res.json({ status: 'Bot nicht geladen' });

  res.json({
    status: 'online',
    bot: client.user.tag,
    guilds: client.guilds.cache.size,
    users: client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)
  });
});

// ─────────────────────────────────────────────
// 🚀 Exportierte Start-Funktion
// ─────────────────────────────────────────────
function startWebServer(client) {
  app.locals.client = client;
  app.listen(PORT, () => {
    console.log(`🌐 Dashboard läuft auf http://localhost:${PORT}`);
  });
}

module.exports = { startWebServer };
