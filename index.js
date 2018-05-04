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
    
    this.on('consumed', this._destroy.bind(this));
  }
  
  consume() {
    const exists = fs.existsSync(this.location);
    if (exists) {
      const secrets = this._read();
      if (secrets) {
        this._parse(secrets);
        this.emit('consumed');
      }
    }
  }
   
  _parse(secrets) {
    secrets.toString().split('\n').forEach(line => {
      const [key, value] = line.split('=');
      global.__secrets__[key] = value;
    });
  }
  
  _read() {
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
  
  _destroy() {
    fs.unlinkSync(this.location);
  }
}

module.exports = Secret;