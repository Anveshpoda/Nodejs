'use strict'
let log4js = require('log4js');
log4js.configure({
  appenders: [
    { 
      type: 'console'
    },
    {
      type: 'file',
      filename: 'logs/notFoundLogger.log',
      category: 'notFoundLogger',
      maxLogSize: 1024 * 1024 * 5, // 10MB size
      backups: 3
    }
  ]
});
let notFoundLogger = log4js.getLogger('notFoundLogger');
notFoundLogger.setLevel('DEBUG');
exports = module.exports = notFoundLogger;