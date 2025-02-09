const express = require("express");
const sequelize = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const cors = require('cors');  
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./docs/swagger.yaml");  
const Eureka = require('eureka-js-client').Eureka;

const app = express();


const eurekaClient = new Eureka({
  instance: {
    app: 'createEmployees-service',  
    hostName: 'localhost',
    ipAddr: '127.0.0.1',
    port: {
      '$': process.env.PORT || 3001,
      '@enabled': true,
    },
    vipAddress: 'users-service',
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn',
    },
    registerWithEureka: true,
    fetchRegistry: true,
  },
  eureka: {
    host: 'localhost',  
    port: 8761,     
    servicePath: '/eureka/apps/',
  },
});

app.use(express.json());
app.use(cors());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/users", userRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  try {
    await sequelize.sync({ force: false });
    eurekaClient.start();
    console.log(`Server running at http://localhost:${PORT}`);
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
});

process.on('SIGINT', () => {
  eurekaClient.stop();
  process.exit();
});