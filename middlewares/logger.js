const axios = require('axios');

const LOG_API_URL = 'http://20.244.56.144/evaluation-service/logs';

const VALID_STACKS = ['backend', 'frontend'];
const VALID_LEVELS = ['debug', 'info', 'warn', 'error', 'fatal'];
const VALID_PACKAGES = [
  'cache', 'controller', 'cron job', 'db', 'domain', 'handler', 'repository',
  'route', 'service', 'api', 'component', 'hook', 'page', 'state', 'style',
  'auth', 'middleware', 'utils'
];


async function Log(stack, level, pkg, message) {
  if (!VALID_STACKS.includes(stack) ||
      !VALID_LEVELS.includes(level) ||
      !VALID_PACKAGES.includes(pkg)) {
    return;
  }

  try {
    await axios.post(LOG_API_URL, {
      stack,
      level,
      package: pkg,
      message
    });
  } catch (err) {
   
    require('fs').appendFileSync('log_errors.txt', err.message + '\\n');
  }
}


const requestLoggerMiddleware = (req, res, next) => {
  Log("backend", "info", "middleware", `${req.method} ${req.originalUrl}`);
  next();
};

module.exports = {
  Log,
  requestLoggerMiddleware
};
