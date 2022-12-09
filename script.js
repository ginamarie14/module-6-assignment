const search = $('#launchSearch');
const userInput = $('#userInput');
const results = $('#results');
const currentForecast = $('#currentForecast');
const fiveDayTitle = $('#five-day-title');
const fiveDayForecastCards = $('#fiveDayForecast');
const searchHistory = $('#search-history');
const apiKey = '64a19c2800e2eb5e9845897d2c651095';

// show last searches
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

// get data from API
const theWeather = (searchedCity) => {
  currentForecast.empty();
  fiveDayTitle.empty();
  fiveDayForecastCards.empty();
  theForecast(searchedCity);
  fiveDayForecast(searchedCity);
}

// current weather forecast
const theForecast = (searchedCity) => {
  const queryUrl =
  `https://api.openweathermap.org/data/2.5/weather?q=${searchedCity}&units=imperial&appid=${apiKey}`;
  $.ajax({
    url: queryUrl,
  })
  .then(showWeather)
  .catch();
};

// generate today's forecast information
const showWeather = (data) => {
  let icon = data.weather[0].icon;
  let date = data.dt;
  let formattedDate = new Date(date * 1000).toLocaleDateString();
  let iconUrl = `https://openweathermap.org/img/w/${icon}.png`;
  $("#currentForecast") //check
  .append(`<h3>${data.name}</h3>`)
  .append(`<h4>(${formattedDate})</h4>`)
  .append(`<img src=${iconUrl}>`)
  .append(`<p>Temperature: ${data.main.temp}&#176;F&nbsp;&nbsp;&nbsp;</p>`)
  .append(`<p>Humidity: ${data.main.humidity}%&nbsp;&nbsp;&nbsp;</p>`)
  .append(`<p>Windspeed: ${data.wind.speed} MPH&nbsp;&nbsp;&nbsp;</p>`);
  UVindex(data.coord.lat, data.coord.lon);
};

// uv index
const UVindex = (latitude, longitude) => {
  let queryUVUrl =
  `https://api.openweathermap.org/data/2.5/uvi?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;    
  $.ajax({
    url: queryUVUrl,
  })
  .then(function (uv) {
    let uvIndex = uv.value;
    $('#currentForecast').append(
      `<p>UV Index:<span>${uvIndex}</span></p>`);
    })
    .catch();
  };
  
  // 5-day forecast
  const fiveDayForecast = (searchedCity) => {
    const query5DayUrl =
    `https://api.openweathermap.org/data/2.5/forecast?q=${searchedCity}&units=imperial&appid=${apiKey}`;
    $.ajax({
      url: query5DayUrl,
    })
    .then(showFiveDayForecast)
    .catch();
  };
  
// generate cards for 5-day forecast
const showFiveDayForecast = (data) => {
  $('#five-day-title').append('<h3>5-Day Forecast:</h3>');
  data.list.forEach((forecast) => {
    let icon = forecast.weather[0].icon;
    let iconUrl = `https://openweathermap.org/img/w/${icon}.png`;
    let date = new Date(forecast.dt * 1000).toLocaleDateString();
    if (forecast.dt_txt.split(" ")[1] == "12:00:00") {
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
   
// search button working
$(search).on('click', (event) => {
  event.preventDefault();
  const searchedCity = userInput.val().toUpperCase();
  theWeather(searchedCity); 
  showSearchHistory(searchedCity);
  saveSearches(searchedCity); 
});
    
let lastSearches = [];

// save searches
const saveSearches = (searchedCity) => {
lastSearches.push(searchedCity);
localStorage.setItem('cities', JSON.stringify(lastSearches));
};

// show search history
const showSearchHistory = (searchedCity) => {
  $('#search-history').append(
    `<button class='btn btn-light btn-block' id='${searchedCity}'>${searchedCity}</button>`
    );
  };

// click on search history tiles to quickly look up a city from user's history
$('#search-history').on('click', (event) => {
  event.preventDefault();
  let btn = event.target.id;
  theWeather(btn);
});
