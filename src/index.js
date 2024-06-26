const express = require("express");
const cors = require('cors');
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const pathEnv = `ENV/.env.${process.env.NODE_ENVIRONMENT}`;
console.log('pathEnv:', pathEnv);
dotenv.config({ path: pathEnv });

const DBData ={
    database: process.env.DB_DATABASE,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'mysql'
}

console.log('DBData:', JSON.stringify(DBData));

const healthController = require("./controllers/HealthController");
const planController = require("./controllers/PlanController");

const app = express();
app.disable("x-powered-by");
app.use(cors({
    origin: '*' //NOSONAR
}));
app.use(express.json());
app.use(bodyParser.json());

app.use("/health", healthController);
app.use("/plans", planController);

// Health check endpoint
app.get("/", (req, res) => {
    res.status(200).json({ status: "OK", code: 200});
});

// HTML endpoint
app.get("/index", (req, res) => {
    const html = "<h1>Welcome to my API!</h1>";
    res.send(html);
});

app.use((req, res) => {
    res.status(404).json({ error: "Not found", code: 404});
});

const PORT = 3000;

function initApp() {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

initApp();

module.exports = app;