const express = require("express");
const config = require("./config/default.json");
const path = require("path");
const mongoose = require("mongoose");
const { RSA_NO_PADDING } = require("node:constants");

const app = express();
const PORT = config.port || 3000;

app.use(express.json({ extended: true }));
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/link", require("./routes/link.routes"));
app.use("/t", require("./routes/redirect.routes"));

if (process.env.NODE_ENV === "production") {
	app.use("/", express.static(path.join(__dirname, "client", "build")));
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
	});
} else {
	app.get("/", (req, res) => {
		res.send("Hello, i`m Linker api");
	});
}

async function start() {
	try {
		await mongoose.connect(config.mongoUri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		});
		app.listen(PORT, () => console.log(`Express! http://localhost:${PORT}`));
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
}

start();
