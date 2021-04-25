import { app, BrowserWindow } from "electron";

const fs = require("fs");
const express = require("express");
const webapp = express();
const router = express.Router();

if (require("electron-squirrel-startup")) {
	// eslint-disable-line global-require
	app.quit();
}

let mainWindow;

const createWindow = () => {
	mainWindow = new BrowserWindow({
		width: 900,
		height: 600,
		title: "Binance Bot",
		resizable: false,
		icon: __dirname + "/icon.png",
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false
		}
	});

	mainWindow.loadURL(`file://${__dirname}/index.html`);
	mainWindow.setMenuBarVisibility(null);

	mainWindow.on("closed", () => {
		mainWindow = null;
	});
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
	const d = require("../../state.json");
	let data = {
		state: false,
		pair: d.pair
	};
	let jstring = JSON.stringify(data, null, 4);
	fs.writeFile("../state.json", jstring, (err) => {
		if (err) throw err;
	});
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	if (mainWindow === null) {
		createWindow();
	}
});

webapp.listen(8000, (err) => {
	if (err) throw err;
	else {
		router.get("/", (req, res) => {
			const data = fs.readFileSync("../JSON/Trades.json");
			const obj = JSON.parse(data)[
				Object.keys(JSON.parse(data))[0]
			].splice(-6);
			res.send(obj);
		});
		router.get("/state", (req, res) => {
			const data = fs.readFileSync("../state.json");
            const obj = JSON.parse(data)
            res.send(obj)
		});

        router.post("/botState", (req, res) => {
            let jsonpair = JSON.parse(fs.readFileSync("../state.json", "utf8")).pair
            let data = {
                state: req.body.state,
                pair: jsonpair
            };
            let jstring = JSON.stringify(data, null, 4);
            fs.writeFile("../state.json", jstring, (err) => {
                if (err) throw err;
                res.send("State written to file")
            });
        })
        router.post("/pair", (req, res) => {
            let jsonstate = JSON.parse(fs.readFileSync("../state.json", "utf8")).state
            let data = {
                state: jsonstate,
                pair: [req.body.pair]
            };
            let jstring = JSON.stringify(data, null, 4);
            fs.writeFile("../state.json", jstring, (err) => {
                if (err) throw err;
                res.send("State written to file")
            });
        })

        webapp.use(express.json())
		webapp.use("/", router);
	}
});
