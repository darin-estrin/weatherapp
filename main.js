$(document).ready(function() {
  var weatherdata = new WeatherData();

  $('#zipcode').on('keypress', function(e) {
    if (e.keyCode === 13 || e.which === 13) {
      weatherdata.setZipCode(e.target.value);
    }
  });

  $('.enter-zipcode').on('click', function(e) {
    var zipcode = $('#zipcode')[0].value;
    weatherdata.setZipCode(zipcode);
  });
});


WeatherData = function() {
  var apiKey = 'f712154df651cacad4b38bdf845228e6';
  this.zipcode = null;
  this.lon = null;
  this.lat = null;

  this.setZipCode = function(zipcode) {
    this.zipcode = zipcode;
    this.getWeather('zipcode');
  }

  this.getWeather = function(method) {
    var query = 'api.openweathermap.org/data/2.5/weather?';
    if (method === 'zipcode') {
      query += 'zip='+this.zipcode+',us&appid='+apiKey;
      console.log(query);
    } else if (method === 'geolocation') {
      query += 'lat='+this.lat+'lon='+this.lon+'appid='+apiKey;
    }
  }
}