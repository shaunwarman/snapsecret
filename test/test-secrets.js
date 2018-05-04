const Test = require('tape');

const Secret = require('..');

Test('snapsecrets', t => {
  
  t.test('init', t => {
    const secret = new Secret();
    t.ok(secret instanceof Secret);
    t.equals(secret.file, '.secrets');
    t.end();
  });
  
  t.test('consume', t => {
    const secret = new Secret();
    secret.consume();
    t.end();
  });
  
});