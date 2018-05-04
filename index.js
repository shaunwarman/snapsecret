const fs = require('fs');
const path = require('path');

global.__secret__ = {};

class Secret {
  constructor() {
    const { 
      file = '.secrets', 
      path = process.cwd(),
      snap = true
    } = options;
    
    this.file = file;
    this.path = path;
    this.snap = snap;
    
    this.location = path.resolve(this.path, this.file);
    
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
    secrets.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      global.__secret__[key] = value;
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
    fs.unlink(this.location);
  }
}