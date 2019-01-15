'use strict'
let Mongoose = require('mongoose').Mongoose
//mongoose.Promise = global.Promise

let logger = require('../logger')
let environment = require('../environment')
let MongoClient = require('mongodb').MongoClient;
let db = new Mongoose;

let envType = process.env.APP_ENVIRONMENT || 'development'
db.connect(environment[envType].databaseurl, { useMongoClient: true })
let dbEvents = db.connection
let server;
dbEvents.on('error', console.error.bind(console, 'Database Connection Error:'))
dbEvents.once('open', function () {
    logger.debug('Connected to the database successfully.')
    //logger.debug("***** http://localhost:3000 ***** ")
    let app = require('../app')
    let http = require('http')
    /**
     * Get port from environment and store in Express.
     */
    let port = normalizePort(process.env.PORT || 8080)
    app.set('port', port)
    /**
  * Create HTTP server.
  */
    server = http.createServer(app)
    let ipaddress = "0.0.0.0"
    /**
     * Listen on provided port, on all network interfaces.
     */
    server.listen(port, ipaddress, function () {
        // logger.debug("Listening on " + ipaddress + ", Port " + port)
    })
    server.on('error', onError)
    server.on('listening', onListening)
    logger.debug(`Worker ${process.pid} started`)
})

exports = module.exports = {
    db : db ,
    Mongoose: Mongoose
}

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
    let port = parseInt(val, 10)
    if (isNaN(port)) {
        // named pipe
        return val
    }
    if (port >= 0) {
        // port number
        return port
    }
    return false
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error
    }
    let bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            logger.error(bind + ' requires elevated privileges')
            process.exit(1)
            break
        case 'EADDRINUSE':
            logger.error(bind + ' is already in use')
            process.exit(1)
            break
        default:
            throw error
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    let addr = server.address()
    let bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port
    logger.debug('Listening on ' + bind)
}