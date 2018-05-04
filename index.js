const fs = require('fs');
const path = require('path');

const {EventEmitter} = require('events');

global.__secrets__ = {};

class Secret extends EventEmitter {
  constructor(options = {}) {
    super();
    
    const { 
      file = '.secrets', 
      filepath = process.cwd(),
      snap = true
    } = options;
    
    this.file = file;
    this.filepath = filepath;
    this.snap = snap;
    
    this.location = path.resolve(this.filepath, this.file);
    
    this.on('consumed', Secret.destroy);
  }
  
  consume() {
    const exists = fs.existsSync(this.location);
    if (exists) {
      const secrets = Secret.read();
      if (secrets) {
        Secret.parse(secrets);
        this.emit('consumed');
      }
    }
  }
   
  static parse(secrets) {
    secrets.toString().split('\n').forEach(line => {
      const [key, value] = line.split('=');
      global.__secrets__[key] = value;
    });
  }
  
  static read() {
    let secrets = null;
    
    try {
      secrets = fs.readFileSync(this.location);
      return secrets;
    }
    catch (e) {
      console.error('no secrets available');
      return secrets;
    }
  }
  
  static destroy() {
    fs.unlinkSync(this.location);
  }
}

module.exports = Secret;