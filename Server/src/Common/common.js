const fs = require("fs");

function formatAMPM(date) {
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var ampm = hours >= 12 ? "pm" : "am";
	hours = hours % 12;
	hours = hours ? hours : 12;
	minutes = minutes < 10 ? "0" + minutes : minutes;
	var strTime = hours + ":" + minutes + " " + ampm;
	return strTime;
}

function getPairs() {
	const data = JSON.parse(fs.readFileSync("../state.json", "utf-8"));
	return data.pair;
}

function getData(pair) {
	const udata = JSON.parse(fs.readFileSync("../JSON/Data.json", "utf-8"))[
		pair
	].prices.splice(-6);
	return udata;
}

function getFirstData(pair) {
	const udata = JSON.parse(fs.readFileSync("../JSON/Data.json", "utf-8"))[
		pair
	].prices[0];
	return udata;
}

function getTrades(pair) {
	try {
		const data = JSON.parse(
			fs.readFileSync("../JSON/Trades.json", "utf-8")
		)[pair].splice(-6);
		return data;
	} catch(err) {
		let i = 0;
		const d = {
			time_stamp: "0",
			price_usd: 0,
			bought: false,
			sold: false,
			amount: 0
		};
		let data = [];
		while (i != 6) {
			data.push(d);
			i++;
		}
		return data;
	}
}
