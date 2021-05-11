const intTime = 120000

class _Chart {
	constructor(type, label, context, coin) {
		this.type = type;
		this.label = label;
		this.context = context;
		this.coin = coin;
	}

	Initialize() {
		this.CHART = new Chart(
			this.context,
			{
				type: this.type,
				data: {
					labels: [],
					datasets: [
						{
							label: this.label,
							data: [],
							backgroundColor: ["rgba(0, 99, 132, 1)"],
							borderColor: ["rgba(0, 99, 132, 1)"],
							borderWidth: 1
						}
					]
				}
			},
			{
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
			}
		);

		const fdata = getFirstData(this.coin);

		this.CHART.data.datasets[0].data.push(fdata[4]);
		this.CHART.data.labels.push(formatAMPM(new Date(fdata[0])));

		this.Update();
		setInterval(() => {
			this.Update();
		}, intTime);
	}

	Update() {
		const data = getData(this.coin);

		for (let i in data) {
			if (this.CHART.data.datasets[0].data.length > 12) {
				this.CHART.data.datasets[0].data.splice(1, 1);
                this.CHART.data.labels.splice(1,1)
			}
			this.CHART.data.datasets[0].data.push(data[i][4]);
			this.CHART.data.labels.push(formatAMPM(new Date(data[i][0])));
		}

		this.CHART.update();
	}
}

class _TChart {
	constructor(type, label, context, coin) {
		this.type = type;
		this.label = label;
		this.context = context;
		this.coin = coin;
	}

	Initialize() {
		this.CHART = new Chart(
			this.context,
			{
				type: this.type,
				data: {
					labels: [],
					datasets: [
						{
							label: this.label,
							data: [],
							backgroundColor: [""],
							borderColor: ["rgba(50,50,50,0.4)"],
							borderWidth: 1
						}
					]
				}
			},
			{
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
			}
		);

		this.SetTrades();
		setInterval(() => {
			this.SetTrades();
		}, intTime);
	}

	SetTrades() {
		const tdata = getTrades(this.coin);

		this.CHART.data.datasets[0].data = [];
		this.CHART.data.labels = [];
		this.CHART.data.datasets[0].borderColor = [];
		this.CHART.data.datasets[0].backgroundColor = [];

		for (let i in tdata) {
			this.CHART.data.datasets[0].data.push(
				tdata[i]["amount"] * tdata[i]["price_usd"]
			);
			this.CHART.data.labels.push(
				formatAMPM(new Date(tdata[i]["time_stamp"] * 1000))
			);
			this.CHART.data.datasets[0].backgroundColor.push(
				!tdata[i]["sold"] ? "rgba(255,50,0,1)" : "rgba(0,255,50,1)"
			);
		}

		if (
			this.CHART.data.datasets[0].backgroundColor[1] !==
			"rgba(255,50,50,1)"
		) {
			this.CHART.data.datasets[0].backgroundColor[0] =
				"rgba(50,255,50,1)";
		} else {
			this.CHART.data.datasets[0].backgroundColor[0] =
				"rgba(255,50,50,1)";
		}

		this.CHART.update();
	}
}
