const expect = require('chai').expect;
const rp = require('request-promise');
process.env.NODE_ENV = 'test';
const app = require('../app');


describe('App', () => {
  const port = 8888;
  const baseUrl = `http://localhost:${ port }`;
  const apiUrl = `${ baseUrl }/api/v1/screenshot`;
  let server;

  before(() => {
    return new Promise(resolve => {
      server = app.listen(port, () => resolve());
    });
  });

  after(() => {
    server.close();
    server = null;
  });

  it('returns a status code of 200', async () => {
    const res = await rp({ uri: baseUrl, resolveWithFullResponse: true });
    expect(res.statusCode).to.equal(200);
  });
});
