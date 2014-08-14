var fixtures = require('./fixtures');

module.exports = function(app) {

  // Everything happens at the index page.
  app.get('/', function(request, response) {
    response.locals.fixture = fixtures.next();
    response.render('index');
  });
};
