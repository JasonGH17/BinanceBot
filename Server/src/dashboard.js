const chartDiv = document.getElementById("charts")

const C = []

let pairs = getPairs()

for(let i in pairs) {
    let cDiv = document.createElement("div")
    cDiv.classList = ["dashboard"]
    chartDiv.appendChild(cDiv)

    let c = document.createElement("canvas")
    c.id = `C${i}`
    c.width = 850
    c.height = 375

    cDiv.appendChild(c)

    const context = c.getContext("2d")
    C.push(context)

    let Chart = new _Chart("line", `${pairs[i]} Price Chart`, context, pairs[i])
    Chart.Initialize()


    let tcDiv = document.createElement("div")
    tcDiv.classList = ["dashboard"]
    chartDiv.appendChild(tcDiv)

    let tc = document.createElement("canvas")
    tc.id = `TC${i}`
    tc.width = 850
    tc.height = 375

    tcDiv.appendChild(tc)

    const tcontext = tc.getContext("2d")
    C.push(tcontext)

    let TChart = new _TChart("line", `${pairs[i]} Trades Chart`, tcontext, pairs[i])
    TChart.Initialize()
}

