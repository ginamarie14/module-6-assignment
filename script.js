const search = $('#launchSearch');
const userInput = $('#userInput');
const results = $('#results'); //check example with weatherContainer in example html and js
const currentForecast = $('#currentForecast');
const fiveDayTitle = $('#five-day-title');
const fiveDayForecastCards = $('#fiveDayForecast');
const searchHistory = $('#search-history');
const apiKey = '64a19c2800e2eb5e9845897d2c651095';



// GET items from storage, pull last array item on page load and set background
$(function() {
  let usersSearches = JSON.parse(localStorage.getItem('cities'));
  if (usersSearches !== null) {
    lastSearches = usersSearches;
    let lastCity = lastSearches[lastSearches.length -1];
    theWeather(lastCity);
    lastSearches.map((city => showSearchHistory(city)));
  }
    return false;
});

// CALL API data functions
const theWeather = (searchedCity) => {
  currentForecast.empty();
  fiveDayTitle.empty();
  fiveDayForecastCards.empty();
  theForecast(searchedCity);
  fiveDayForecast(searchedCity);
}

// API call for current day weather
const theForecast = (searchedCity) => {
  const queryUrl =
  `https://api.openweathermap.org/data/2.5/weather?q=${searchedCity}&units=imperial&appid=${apiKey}`;
  $.ajax({
    url: queryUrl,
  })
  .then(showWeather)
  .catch();
};

// RENDER current day data and elements
const showWeather = (data) => {
  let icon = data.weather[0].icon;
  let date = data.dt;
  let formattedDate = new Date(date * 1000).toLocaleDateString();
  let iconUrl = `https://openweathermap.org/img/w/${icon}.png`;
  $("#currentForecast") //check
  .append(`<h3>${data.name}</h3>`)
  .append(`<h4>(${formattedDate})</h4>`)
  //.append(`<img src=${iconUrl}>`)
  .append(`<p>Temperature: ${data.main.temp}&#176;F</p>`)
  .append(`<p>Humidity: ${data.main.humidity}%</p>`)
  .append(`<p>Windspeed: ${data.wind.speed}MPH</p>`);
  UVindex(data.coord.lat, data.coord.lon);
};

// API call and funtion for UV index and conditional statements for UV colour status
const UVindex = (latitude, longitude) => {
  let queryUVUrl =
  `https://api.openweathermap.org/data/2.5/uvi?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;    
  $.ajax({
    url: queryUVUrl,
  })
  .then(function (uv) {
    let uvIndex = uv.value;
    $('#currentForecast').append(
      `<p>UV Index: <span>${uvIndex}</span></p>`);
    })
    .catch();
  };
  
  // API call for 5 day forecast
  const fiveDayForecast = (searchedCity) => {
    const query5DayUrl =
    `https://api.openweathermap.org/data/2.5/forecast?q=${searchedCity}&units=imperial&appid=${apiKey}`;
    $.ajax({
      url: query5DayUrl,
    })
    .then(showFiveDayForecast)
    .catch();
  };
  
// RENDER 5 day forecast data and elements
const showFiveDayForecast = (data) => {
  $('#five-day-title').append('<h3>5-Day Forecast:</h3>');
  data.list.forEach((forecast) => {
    let icon = forecast.weather[0].icon;
    let iconUrl = `https://openweathermap.org/img/w/${icon}.png`;
    let date = new Date(forecast.dt * 1000).toLocaleDateString();
    if (forecast.dt_txt.split(" ")[1] == "09:00:00") {
      $('#fiveDayForecast').append(
        `<div class="card" style="width: 14rem;><div class="card-body">
        <img src=${iconUrl}>
        <p>${date}</p>
        <p>Temperature: ${forecast.main.temp}&#176;F</p>
        <p>Humidity: ${forecast.main.humidity}%</p>
        </div></div>`
        );
      }
    });
  };
    
$(search).on('click', (event) => {
  event.preventDefault();
  const searchedCity = userInput.val().toUpperCase();
  theWeather(searchedCity); 
  showSearchHistory(searchedCity);
  saveSearches(searchedCity); 
});
    
let lastSearches = [];

// SET items to storage
const saveSearches = (searchedCity) => {
lastSearches.push(searchedCity);
localStorage.setItem('cities', JSON.stringify(lastSearches));
};

// RENDER search history list function
const showSearchHistory = (searchedCity) => {
  $('#search-history').append(
    `<button class='btn btn-light btn-block' id='${searchedCity}'>${searchedCity}</button>`
    );
  };

// EVENT LISTENER on search history clicks
$('#searchHistoryContainer').on('click', (event) => {
  event.preventDefault();
  let btn = event.target.id;
  theWeather(btn);
});
