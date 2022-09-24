import log4js from 'log4js';

const logPath = process.env.LOG_PATH ?? 'app.log';

log4js.configure({
  appenders: { 
    app: { type: 'file', filename: logPath },
    controllers: { type: 'file', filename: logPath },
  },
  categories: { default: { appenders: ['app'], level: process.env.LOG_LEVEL ?? 'debug' }},
});

const loggerApp = log4js.getLogger('app');
const loggerControllers = log4js.getLogger('controllers');

export { 
  loggerApp,
  loggerControllers
}
