require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/api', userRoutes);

app.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}`);
  try {
    await sequelize.authenticate();
    console.log('Database connection successful.');
  } catch (error) {
    console.error('Failed to connect to the database:', error);
  }
});
