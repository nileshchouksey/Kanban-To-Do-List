// config/corsConfig.js
const allowedOrigins = [
  'http://localhost:8080', // local dev frontend
  'https://kanban-to-do-list-pearl.vercel.app', // your Vercel frontend
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

module.exports = corsOptions;
