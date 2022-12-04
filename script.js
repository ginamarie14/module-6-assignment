// Reference variables for DOM
const search = $('#launchSearch');
const currentLocation = inputPart.querySelector("#current-location");
const currectForecase = $('#currentForecast');
const userInput = $('#userInput');
const results = $('#results');
const fiveDayForecast = fiveDayForecast.querySelector('#fiveDayForecast');
const API = ('will add');

// GET items from storage, pull last array item on page load and set background
$(function() {
  backgroundImage();
  let retrievedArray = JSON.parse(localStorage.getItem('cities'));
  if (retrievedArray !== null) {
    saveArray = retrievedArray;
    let lastcity = saveArray[saveArray.length -1];
    getData(lastcity);
    saveArray.map((city => renderSearchHistory(city)));
  }
    return false;
});

// CALL API data functions
const callAPI = (userCity) => { //getData
  currentWeatherContainer.empty();
  forecastHeader.empty();
  fiveDayContainer.empty();
  getCurrentForecast(userCity);
  getFiveDayForecast(userCity);
}

// API call for current day weather
const getCurrentForecast = (usercity) => {
  const queryUrl =
  `https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m`;
  $.ajax({
    url: queryUrl,
  })
  .then(showTheWeather)
  .catch();
};

// RENDER current day data and elements
const showTheWeather = (data) => {
  //let icon = data.weather[0].icon;
  let date = data.dt;
  let formattedDate = new Date(date * 1000).toLocaleDateString();
  let iconUrl = `https://openweathermap.org/img/w/${icon}.png`;
  $("#currentWeatherContainer")
  .append(`<h2>${data.name}</h2>`)
  .append(`<h2>(${formattedDate})</h2>`)
  .append(`<img src=${iconUrl}>`)
  .append(`<p>Temperature: ${data.main.temp}&#176;C</p>`)
  .append(`<p>Humidity: ${data.main.humidity}%</p>`)
  .append(`<p>Windspeed: ${data.wind.speed}MPH</p>`);
  getUvIndex(data.coord.lat, data.coord.lon);
};

// API call and funtion for UV index and conditional statements for UV colour status
const getUvIndex = (latitude, longitude) => {
  let queryUVUrl =
  `https://api.openweathermap.org/data/2.5/uvi?lat=${latitude}&lon=${longitude}&appid=${myKey}`;    
  $.ajax({
    url: queryUVUrl,
  })
  .then(function (uv) {
    let uvIndex = uv.value;
    $('#currentWeatherContainer').append(
      `<p>UV Index:<span>${uvIndex}</span></p>`);
      if (uvIndex <= 2) {
        $('#currentWeatherContainer')
        .find('span')
        .addClass('bg-success text-white');
      } else if (uvIndex > 2 && uvIndex < 7) {
        $('#currentWeatherContainer')
        .find('span')
        .addClass('bg-warning text-dark');
      } else {
        $("#currentWeatherContainer")
        .find('span')
        .addClass('bg-danger text-white');
      }
    })
    .catch();
  };
  
  // API call for 5 day forecast
  const getFiveDayForecast = (usercity) => {
    const query5DayUrl =
    `https://api.openweathermap.org/data/2.5/forecast?q=${usercity}&units=metric&appid=${myKey}`;
    $.ajax({
      url: query5DayUrl,
    })
    .then(handle5DayWeatherData)
    .catch();
  };
  
  // RENDER 5 day forecast data and elements
  const handle5DayWeatherData = (data) => {
    $('#forecastHeader').append('<h4>5-Day Forecast:</h4>');
    data.list.forEach((forecast) => {
      let icon = forecast.weather[0].icon;
      let iconUrl = `https://openweathermap.org/img/w/${icon}.png`;
      let date = new Date(forecast.dt * 1000).toLocaleDateString();
      if (forecast.dt_txt.split(" ")[1] == "09:00:00") {
        $('#forecastContainer').append(
          `<div class="card bg-primary text-white"><div class="card-body">
          <p>${date}</p>
          <img src=${iconUrl}>
          <p>Temp: ${forecast.main.temp}&#176;C</p>
          <p>Humidity: ${forecast.main.humidity}%</p>
          </div></div>`
          );
        }
      });
    };
    
    // EVENT LISTENER for user search input
    $(weatherSearchBtn).on('click', (event) => {
      event.preventDefault();
      const usercity = userInput.val().toUpperCase();
      getData(usercity); 
      renderSearchHistory(usercity);
      saveSearches(usercity); 
    });
    
    let lastSearches = [];

    // SET items to storage
    const saveSearches = (usercity) => {
      lastSearches.push(usercity);
      localStorage.setItem('cities', JSON.stringify(lastSearches));
    };

    // RENDER search history list function
    const renderSearchHistory = (usercity) => {
      $('#searchHistoryContainer').append(
        `<button class='btn btn-light btn-block' id='${usercity}'>${usercity}</button>`
        );
      };

      // EVENT LISTENER on search history clicks
      $('#searchHistoryContainer').on('click', (event) => {
        event.preventDefault();
        let btn = event.target.id;
        getData(btn);
      });
