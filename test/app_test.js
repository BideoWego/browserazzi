const expect = require('chai').expect;
const rp = require('request-promise').defaults({ resolveWithFullResponse: true });

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
    const res = await rp(baseUrl);
    expect(res.statusCode).to.equal(200);
  });

  it('allows submitting a form', async () => {
    const res = await rp({
      uri: apiUrl,
      method: 'POST',
      form: { url: 'http://google.com' }
    });
    expect(res.statusCode).to.equal(200);
  });

  it('returns not found when a route is not supported', async () => {
    try {
      const res = await rp(`${ baseUrl }/asdf`);
      expect(res.statusCode).to.equal(404);
    } catch (e) {}
  });
});
