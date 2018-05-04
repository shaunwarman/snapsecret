const Express = require('express');
const Secret = require('snapsecrets');

const App = Express();

const secret = new Secret();

const {NODE_PORT} = process.env;

App.get('/env', (req, res) => {
  res.send(JSON.stringify(process.env));
});

App.get('/secret', (req, res) => {
  res.send(JSON.stringify(global.__secrets__));
});

App.listen(NODE_PORT, () => {
  console.log(`Listening on port ${NODE_PORT}`);
  secret.consume();
});