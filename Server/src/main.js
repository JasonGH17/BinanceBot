const fs = require("fs");

const togglebtn = document.getElementById("bot-toggle");
const pairinput = document.getElementById("pair-input");
const pairsubmit = document.getElementById("submit-pair");

togglebtn.checked = JSON.parse(fs.readFileSync("../state.json", "utf8")).state
pairinput.value = JSON.parse(fs.readFileSync("../state.json", "utf8")).pair[0]

togglebtn.addEventListener("click", () => {
    let jsonpair = JSON.parse(fs.readFileSync("../state.json", "utf8")).pair
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