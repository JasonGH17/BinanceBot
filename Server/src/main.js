const fs = require("fs");

const togglebtn = document.getElementById("bot-toggle");
const pairinput = document.getElementById("pair-input");
const usdtinput = document.getElementById("usdt-input");
const pairsubmit = document.getElementById("submit-pair");
const usdtsubmit = document.getElementById("submit-usdt");

togglebtn.checked = JSON.parse(fs.readFileSync("../state.json", "utf8")).state;
pairinput.value = JSON.parse(fs.readFileSync("../state.json", "utf8")).pair[0];

togglebtn.addEventListener("click", () => {
	let jsonpair = JSON.parse(fs.readFileSync("../state.json", "utf8")).pair;
	let data = {
		state: togglebtn.checked,
		pair: jsonpair
	};
	let jstring = JSON.stringify(data, null, 4);
	fs.writeFile("../state.json", jstring, (err) => {
		if (err) throw err;
		console.log("State written to file");
	});
});
pairsubmit.addEventListener("click", () => {
	let data = {
		state: togglebtn.checked,
		pair: pairinput.value == "" ? ["BTCUSDT"] : [pairinput.value]
	};
	let jstring = JSON.stringify(data, null, 4);
	fs.writeFile("../state.json", jstring, (err) => {
		if (err) throw err;
		console.log("State written to file");
	});
});
usdtsubmit.addEventListener("click", () => {
	let oldJson = JSON.parse(fs.readFileSync("../JSON/Balance.json", "utf-8"));
	oldJson.USDT = usdtinput.value == "" ? "0" : usdtinput.value;
	fs.writeFile("../JSON/Balance.json", JSON.stringify(oldJson), (err) => {
		if (err) throw err;
		console.log("Balance written to file: " + JSON.stringify(oldJson));
	});
});

let dataT = JSON.parse(fs.readFileSync("../state.json", "utf-8"));
let tradeT = JSON.parse(fs.readFileSync("../JSON/Balance.json", "utf-8"));
if (pairinput !== document.activeElement) {
	pairinput.value = dataT.pair[0];
}
if (usdtinput !== document.activeElement) {
	usdtinput.value = tradeT.USDT;
}
togglebtn.checked = dataT.state;

setInterval(() => {
	let data = JSON.parse(fs.readFileSync("../state.json", "utf-8"));
	let trade = JSON.parse(fs.readFileSync("../JSON/Balance.json", "utf-8"));
	if (pairinput !== document.activeElement) {
		pairinput.value = data.pair[0];
	}
	if (usdtinput !== document.activeElement) {
		usdtinput.value = trade.USDT;
	}
	togglebtn.checked = data.state;
}, 2000);
