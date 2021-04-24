const fs = require("fs");

const balanceContext = document.getElementById("balancechart").getContext("2d");

let balanceChart = new Chart(balanceContext, {
	type: "line",
	data: {
		labels: ["1", "2", "3", "4", "5", "6"],
		datasets: [
			{
				label: "Amount of USDT over time",
				data: [],
				backgroundColor: ["rgba(0, 99, 132, 1)"],
				borderColor: ["rgba(0, 99, 132, 1)"],
				borderWidth: 1
			}
		]
	},
	options: {
		scales: {
			y: {
				ticks: {
					callback: function (value, index, values) {
						return value + " USDT";
					}
				}
			}
		}
	}
});

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

function getTrades(chart) {
	const data = fs.readFileSync("../JSON/Trades.json");
	const obj = JSON.parse(data)[Object.keys(JSON.parse(data))[0]].splice(-6);
	chart.data.datasets[0].data = [
		obj[0].price_usd * obj[0].amount,
		obj[1].price_usd * obj[1].amount,
		obj[2].price_usd * obj[2].amount,
		obj[3].price_usd * obj[3].amount,
		obj[4].price_usd * obj[4].amount,
		obj[5].price_usd * obj[5].amount
	];
	chart.data.labels = [
		formatAMPM(new Date(obj[0].time_stamp * 1000)),
		formatAMPM(new Date(obj[1].time_stamp * 1000)),
		formatAMPM(new Date(obj[2].time_stamp * 1000)),
		formatAMPM(new Date(obj[3].time_stamp * 1000)),
		formatAMPM(new Date(obj[4].time_stamp * 1000)),
		formatAMPM(new Date(obj[5].time_stamp * 1000))
	];
	chart.update();
}

getTrades(balanceChart);

setInterval(() => {
	getTrades(balanceChart);
}, 120000);
