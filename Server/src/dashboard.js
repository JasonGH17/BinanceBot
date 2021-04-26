const fs = require("fs");

const balanceContext = document.getElementById("balancechart").getContext("2d");
const priceContext = document.getElementById("pricechart").getContext("2d");

let coin = JSON.parse(fs.readFileSync("../state.json", "utf-8")).pair[0];

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

let priceChart = new Chart(priceContext, {
	type: "line",
	data: {
		labels: ["1", "2", "3", "4", "5", "6"],
		datasets: [
			{
				label: `Price of ${coin} over time`,
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
    console.log(strTime)
	return strTime;
}

function getTrades(chart, pChart) {
	const data = fs.readFileSync("../JSON/Trades.json");
	const data2 = fs.readFileSync("../JSON/Data.json");
	const obj = JSON.parse(data)[Object.keys(JSON.parse(data))[0]].splice(-6);
	const obj2 = JSON.parse(data2)[
		Object.keys(JSON.parse(data2))[0]
	].prices.splice(-6);

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

	pChart.data.datasets[0].data = [
		obj2[0][4],
		obj2[1][4],
		obj2[2][4],
		obj2[3][4],
		obj2[4][4],
		obj2[5][4]
	];
	pChart.data.labels = [
		formatAMPM(new Date(obj2[0][0])),
		formatAMPM(new Date(obj2[1][0])),
		formatAMPM(new Date(obj2[2][0])),
		formatAMPM(new Date(obj2[3][0])),
		formatAMPM(new Date(obj2[4][0])),
		formatAMPM(new Date(obj2[5][0]))
	];

	chart.update();
	pChart.update();
}

getTrades(balanceChart, priceChart);

setInterval(() => {
	getTrades(balanceChart, priceChart);
}, 1000);
