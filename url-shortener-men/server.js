const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const { requestLoggerMiddleware } = require('./middlewares/logger');
const shortUrlRoutes = require('./routes/shortUrlRoutes');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLoggerMiddleware); 

app.use('/', shortUrlRoutes);

// Mongo + Server
mongoose.connect(process.env.DB_URI)
  .then(() => {
    app.listen(process.env.PORT, () =>
      console.log(`Server running at http://localhost:${process.env.PORT}`)
    );
  })
  .catch((err) => console.error('DB Error:', err));
