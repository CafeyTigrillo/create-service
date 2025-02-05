const express = require("express");
const sequelize = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const cors = require('cors');  
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./docs/swagger.yaml");  

const app = express();
app.use(express.json());
app.use(cors());  // This will allow all CORS requests

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/users", userRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  try {
    await sequelize.sync({ force: false });
    console.log(`Server running at http://localhost:${PORT}`);
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
});
