// ℹ️ Gets access to environment variables/settings

require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
const express = require("express");

const hbs = require("hbs");

const app = express();

require("./config")(app);

const capitalized = require("./utils/capitalized");
const projectName = "eventree";

app.locals.appTitle = `${capitalized(projectName)}`;

// Start handling routes here
const index = require("./routes/index.routes");
app.use("/", index);

const authRouter = require("./routes/auth.routes");
app.use("/", authRouter);
app.use(require("./routes/profile.routes"));

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
