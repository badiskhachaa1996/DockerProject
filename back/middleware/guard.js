const { User } = require("./models/user");
const jwt = require("jsonwebtoken");

function haveAccess(lvl, headers, callback) {
    if (!headers.token) {
        callback(false)
    }
    let token = jwt.decode(headers.token)
    if (!headers.origin || !token.id) {
        callback(false)
    }

    User.findOne({ _id: token.id }, (err, user) => {
        if (user && (headers.origin == "https://ticket.estya.com" || headers.origin == "http://localhost:4200" || headers.origin == "http://localhost:4210")) {
            if (lvl == "Admin") {
                callback(user.role == "Admin")
            } else if (lvl == "Responsable") {
                callback(user.role == "Responsable" || user.role == "Admin")
            } else if (lvl == "Agent") {
                callback(user.role == "Agent" || user.role == "Responsable" || user.role == "Admin")
            } else {
                callback(lvl == user_id)
            }
        } else {
            callback(false)
        }
    })
}
