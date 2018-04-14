$(document).ready(function() {
  var weatherData = new WeatherData();

  function getLocation() {
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(showPosition);
    }
  }
  
  function showPosition(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    weatherData.setLatLong(lat, lon);
  }

  $('#zipcode').on('keypress', function(e) {
    if (e.keyCode === 13 || e.which === 13) {
      weatherData.setZipCode(e.target.value);
    }
  });

  $('.enter-zipcode').on('click', function(e) {
    var zipcode = $('#zipcode')[0].value;
    weatherData.setZipCode(zipcode);
  });

  $('.get-location').on('click', getLocation);
});

function WeatherData() {
  var apiKey = 'f712154df651cacad4b38bdf845228e6';
  this.zipcode = null;
  this.lon = null;
  this.lat = null;
  this.data = null;

  /**
   * 
   * @param {string} method 
   * either uses a zipcode or gelocation to generate the api query
   */
  this.getWeather = function(method) {
    var query = 'https://api.openweathermap.org/data/2.5/weather?';
    if (method === 'zipcode') {
      query += 'zip='+this.zipcode+',us&appid='+apiKey;
    } else if (method === 'geolocation') {
      query += 'lat='+this.lat+'&lon='+this.lon+'&appid='+apiKey;
    }

    $.getJSON(query, function(data) {
      this.data = data;
    });
  }

  /**
   * 
   * @param {number} lat 
   * @param {number} lon 
   */
  this.setLatLong = function(lat, lon) {
    this.lat = lat;
    this.lon = lon;
    this.getWeather('geolocation');
  }

  /**
   * 
   * @param {string} zipcode 
   * sets the user entered zipcode to generate a api query
   */
  this.setZipCode = function(zipcode) {
    this.zipcode = zipcode;
    this.getWeather('zipcode');
  }
}