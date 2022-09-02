const fs = require("fs")
fs.rename("../storage/prospect/TEST", "../storage/etudiant/TEST",(err)=>{
    console.error(err)
})
