const express = require("express");
const { connectedToDatabase } = require("./src/config/dbConfig");
const { userRouter } = require("./src/routes/user.routes");
const { todoRouter } = require("./src/routes/kanban.routes");
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const app = express();
require("dotenv").config();
const cors = require('cors');
const PORT = process.env.port 
app.use(express.json());
app.use(cors());


const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Kanban Board',
      version: '1.0.0',
    },
    servers:[
        {
            url:"http://localhost:8080/"
        }
    ]
  },
  apis: ['./src/routes/*.js'], 
};

const openapiSpecification = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

app.get("/", (req, res) => {
  res.json({ message: "serever is up" });
});

app.use('/user',userRouter);
app.use('/todo',todoRouter);

app.listen(PORT, async () => {
  try {
    await connectedToDatabase();
    console.log(`The app is running on port http://localhost:${PORT}`);
  } catch (error) {
    console.log(error.message);
  }
});
