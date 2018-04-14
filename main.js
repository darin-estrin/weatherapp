$(document).ready(function() {
  $('.weather-info').hide();

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
  this.icon = null;

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
      this.icon = 'https://openweathermap.org/img/w/'+this.data.weather[0].icon+'.png';
      this.updateWeather();
    }.bind(this));
  }

  /**
   * 
   * @param {number} direction 
   * the direction the wind is moving in degrees
   */
  this.getWindDirection = function(direction) {
    if (direction >= 0 && direction < 24 || direction > 337 ) {
      return 'north';
    } else if (direction > 23 && direction < 69) {
      return 'north-east';
    } else if (direction > 68 && direction < 113) {
      return 'east';
    } else if (direction > 112 && direction < 158) {
      return 'south-east';
    } else if (direction > 157 && direction < 206) {
      return 'south';
    } else if (direction > 205 && direction < 251) {
      return 'south-west';
    } else if (direction > 250 && direction < 296) {
      return 'west';
    } else {
      return 'north-west';
    }
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

  /**
   * Updates the DOM with the appropriate data
   */
  this.updateWeather = function() {
    var tempInCel = (this.data.main.temp - 273.15).toFixed(1);
    var tempInFahr = ((tempInCel * (9 / 5)) + 32).toFixed(1);
    var windDirection = this.getWindDirection(this.data.wind.deg);
    if (this.data.weather[0].icon.substr(2) === 'd') {
      $('.wrapper').css('background-image', 'url(day.jpg)');
    } else {
      $('.wrapper').css('background-image', 'url(night.jpg)');
    }
    $('.weather-info').show();
    $('.city').text(this.data.name);
    $('.weather').text(this.data.weather[0].main);
    $('.weather-icon').attr('src', this.icon);
    $('.celcius').html(tempInCel + '&deg; C');
    $('.fahrenheit').html(tempInFahr + ' &deg; F');
    $('.wind-speed').text((this.data.wind.speed * 2.24).toFixed(1) + ' MPH');
    $('.wind-direction').show().addClass(windDirection);
  }
}