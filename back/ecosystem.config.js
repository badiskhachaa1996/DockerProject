module.exports = {
    apps : [{
      name   : "BACKEND EMS",
      script : "./index.js",
      env_prod: {
        origin: "https://ticket.estya.com/"
      },
      env_local: {
        origin: "http://localhost:4200/"
      },
      env_dev:{
        origin: "https://t.dev.estya.com/"
      }
    }]
  }