const fs = require("fs")

const togglebtn = document.getElementById("bot-toggle")

togglebtn.addEventListener("click", ()=>{
    let data = {state: togglebtn.checked}
    let jstring = JSON.stringify(data, null, 4)
    fs.writeFile("../state.json", jstring, err=>{
        if(err) throw err
        console.log("State written to file")
    })
})