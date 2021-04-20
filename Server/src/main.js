const fs = require("fs");

const togglebtn = document.getElementById("bot-toggle");
const pairinput = document.getElementById("pair-input");
const pairsubmit = document.getElementById("submit-pair");

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

function getTrades() {
    fs.readFile("../JSON/Trades.json", (err, data) => {
        if(err) throw err
        const obj = JSON.parse(data)
        console.log(obj)
    })
}

togglebtn.addEventListener("click", () => {
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

console.log(formatAMPM(new Date(1618936740000*1000)));
getTrades()