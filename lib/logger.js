const winston = require("winston");
const logger = new winston.Logger({
  level: 'info',
  transports:[
    new winston.transports.File({filename:"streamDeck.loc"})
  ]
})

if (process.env.NODE_ENV != "production"){
  logger.add(new winston.transports.Console({
  }));
}

module.exports = logger;
