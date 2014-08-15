var moment = require('moment-timezone');
var URL = 'http://www.liverpoolfc.com/ical/first-team/2014+-+2015/fixturelist.ics';
var fixtures = [];

(function() {
  require('ical').fromURL(URL, {}, function(err, data) {
    for(var key in data) {
      if(!data.hasOwnProperty(key)) continue;

      var fixture = data[key];
      if(fixture.type === 'VEVENT') {
        // Fix the bug of parsing the date in local time rather than provided timezone.
        fixture.start.setMinutes(fixture.start.getMinutes() - moment().zone() + moment().tz(fixture.start.tz).zone());
        fixture.end.setMinutes(fixture.end.getMinutes() - moment().zone() + moment().tz(fixture.start.tz).zone());
        
        var homeGame = /^Liverpool/.test(fixture.summary);
        var versus = homeGame ? fixture.summary.split('v').pop() : fixture.summary.split('v').shift();
        
        fixtures.push({
          versus: versus,
          start: fixture.start.getTime(),
          end: fixture.end.getTime(),
          location: homeGame ? 'H' : 'A'
        });
      }
    }
    fixtures.sort(function(a, b) {
      return a.start - b.start;
    });
  });
})()

function findUpcomingFixture() {
  var now = new Date();
  for(var index = 0, len = fixtures.length; index < len; index++ ) {
    if(fixtures[index].start > now) return fixtures[index];
  }
  return -1;
}

module.exports = {
  next: findUpcomingFixture
}
