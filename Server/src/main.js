const fs = require("fs")

const togglebtn = document.getElementById("toggle-bot")
let state = false

togglebtn.addEventListener("click", ()=>{
    state = !state
    let data = {state: state}
    let jstring = JSON.stringify(data, null, 4)
    fs.writeFile("../state.json", jstring, err=>{
        if(err) throw err
        console.log("State written to file")
    })
    console.log(state)
})