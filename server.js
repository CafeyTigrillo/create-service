const express = require("express");
const sequelize = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const cors = require('cors');  
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./docs/swagger.yaml");  
const Eureka = require('eureka-js-client').Eureka;

const app = express();
const PORT = 3001;

const eurekaClient = new Eureka({
  instance: {
    app: 'usersemployees-service',
    hostName: 'localhost',
    ipAddr: '127.0.0.1',
    port: {
      '$': PORT,
      '@enabled': true,
    },
    vipAddress: 'usersemployees-service',
    statusPageUrl: `http://localhost:${PORT}/info`,
    healthCheckUrl: `http://localhost:${PORT}/health`,
    homePageUrl: `http://localhost:${PORT}`,
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn',
    },
    registerWithEureka: true,
    fetchRegistry: true,
    leaseRenewalIntervalInSeconds: 30,
    leaseExpirationDurationInSeconds: 90,
  },
  eureka: {
    host: 'localhost',
    port: 8761,
    servicePath: '/eureka/apps/',
    maxRetries: 10,
    requestRetryDelay: 2000,
    heartbeatInterval: 5000,
    registryFetchInterval: 5000,
  },
});

app.get('/health', (req, res) => {
  res.json({ status: 'UP' });
});

app.get('/info', (req, res) => {
  res.json({
    app: 'users-service',
    status: 'UP',
    timestamp: new Date()
  });
});

app.use(express.json());
app.use(cors());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/users", userRoutes);

app.listen(PORT, async () => {
  try {
    await sequelize.sync({ force: false });
    eurekaClient.start(error => {
      console.log(error || 'Eureka registration complete');
    });
    console.log(`Server running at http://localhost:${PORT}`);
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
});

process.on('SIGINT', () => {
  eurekaClient.stop(error => {
    console.log('Deregistered from Eureka');
    process.exit();
  });
});