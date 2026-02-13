// Logger simples para desenvolvimento
class Logger {
  static info(message, data = null) {
    console.log(`ℹ️  [INFO] ${new Date().toISOString()} - ${message}`);
    if (data) console.log(data);
  }

  static error(message, error = null) {
    console.error(`❌ [ERROR] ${new Date().toISOString()} - ${message}`);
    if (error) {
      console.error(error.message);
      if (process.env.NODE_ENV === 'development') {
        console.error(error.stack);
      }
    }
  }

  static warn(message, data = null) {
    console.warn(`⚠️  [WARN] ${new Date().toISOString()} - ${message}`);
    if (data) console.warn(data);
  }

  static success(message, data = null) {
    console.log(`✅ [SUCCESS] ${new Date().toISOString()} - ${message}`);
    if (data) console.log(data);
  }

  static debug(message, data = null) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🐛 [DEBUG] ${new Date().toISOString()} - ${message}`);
      if (data) console.log(data);
    }
  }
}

module.exports = Logger;
