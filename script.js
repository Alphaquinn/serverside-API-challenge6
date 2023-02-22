const apiKey = "842c3948b50987469451e4a23adc7e2e";
const citySearchButton = document.querySelector("#userCityButton");
const cityNameEl = document.querySelector("#userCityInput");
let citySearchHistory = JSON.parse(localStorage.getItem("cityHistory")) || [];
const cityHistoryColumnEl = document.querySelector("#cityHistory");
const currentCityWeatherEl = document.getElementById("currentCityweather");
let today = new Date().toLocaleDateString();
let currentCityLat;
let currentCityLon;
const fiveDayEl = document.querySelector("#fiveDay");


const getCurrentWeatherHandler = function (event) {
  currentCityWeatherEl.innerHTML = "";
  const cityName = cityNameEl.value.trim();
  
  cityNameEl.value = "";
  APIBuilder(cityName);
};



const APIBuilder = function(cityName){
  currentCityWeatherEl.innerHTML = "";
  const currentWeatherApiUrl =
    "http://api.openweathermap.org/data/2.5/weather?q=" +cityName +"&units=imperial" +"&appid=" +
    apiKey;
  console.log("current weather api: " + currentWeatherApiUrl);
  fetch(currentWeatherApiUrl).then(function (response) {
    if (response.ok) {
      citySearchHandler(cityName);
      console.log(response);
      response.json().then(function (data) {
        console.log("current weather data: ");
        console.log(data);
        const currentCityName = document.createElement("h2"); //creating tag for current city
        const currentCityTemp = document.createElement("p");
        const currentCityHumidity = document.createElement("p");
        const currentCityWind = document.createElement("p");

        currentCityName.textContent = `${data.name}, ${today}`; //grab the name from the data
        currentCityTemp.textContent = `Temp: ${data.main.temp} °F`;
        currentCityHumidity.textContent = `Humidity: ${data.main.humidity} %`;
        currentCityWind.textContent = `Wind: ${data.wind.speed} MPH`;

        currentCityWeatherEl.append(
          currentCityName,
          currentCityTemp,
          currentCityHumidity,
          currentCityWind
        );

        currentCityLat = data.coord.lat;
        currentCityLon = data.coord.lon;
        console.log(currentCityLon);
        console.log(currentCityLat);
        oneCallWeatherHandler();
      });
    }
  });
};


const oneCallWeatherHandler = function () {
  const oneCallApiUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    currentCityLat +
    "&lon=" +
    currentCityLon +
    "&exclude=minutely,hourly&units=imperial&appid=" +
    apiKey;
  console.log("one call api:");
  console.log(oneCallApiUrl);
  fetch(oneCallApiUrl).then(function (response) {
    console.log("one call response: " + response);
    response.json().then(function (data) {
      console.log("one call data:");
      console.log(data);
      const currentCityUvi = document.createElement("p");

      if (data.current.uvi < 3){
        currentCityUvi.classList.add("uvLow");
      } else if (data.current.uvi > 2 && data.current.uvi < 8) {
        currentCityUvi.classList.add("uvMed");
      } else {
        currentCityUvi.classList.add("uvHigh");
      }
      currentCityUvi.textContent = `UVI: ${data.current.uvi}`;
      currentCityWeatherEl.append(currentCityUvi);
      fiveDayElHandler(data.daily);
    });
  });
};

const fiveDayElHandler = function(fiveDayData) {
  fiveDayEl.innerHTML = ""
  for (let i=1; i<6; i++){
    let newDate = new Date(fiveDayData[i].dt*1000).toLocaleDateString("en-US")
    let newDiv = document.createElement("div");
    newDiv.classList.add("col-lg")
    let newEl = `<div class="card">
        <img src="http://openweathermap.org/img/wn/${fiveDayData[i].weather[0].icon}@2x.png" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">${newDate}</h5>
          <p class="card-text">Temp: ${fiveDayData[i].temp.day} </p>
          <p class="card-text">Wind: ${fiveDayData[i].wind_speed}</p>
          <p class="card-text">Humidity: ${fiveDayData[i].humidity}</p>
        </div>
      </div>`
newDiv.innerHTML = newEl;
fiveDayEl.append(newDiv);
  }
};


var citySearchHandler = function (cityName) {
  if (!citySearchHistory.includes(cityName)) {
    citySearchHistory.push(cityName);
    console.log(citySearchHistory);
    cityButtonFactory(cityName);
  }
 saveCity(citySearchHistory); 
};



let saveCity = function (cityHistory) {

  localStorage.setItem("cityHistory", JSON.stringify(cityHistory));
};

/////    load saved cities name to page(history button)    /////
let loadCity = function () {
  let loadedCityName = localStorage.getItem("cityHistory");
};

/////     create button for historical city    /////
const cityButtonFactory = function (cityName) {
  let citySearchHistoryEl = document.createElement("button");
  citySearchHistoryEl.type = "button";
  citySearchHistoryEl.className = "btn btn-secondary btnMargin";
  citySearchHistoryEl.innerText = cityName;
  cityHistoryColumnEl.appendChild(citySearchHistoryEl);
  citySearchHistoryEl.addEventListener("click", () => APIBuilder(cityName));
};


const loadSearchHistory = function () {
  const loadCityHistory = localStorage.getItem("cityHistory");
  const parsedCityHistory = JSON.parse(loadCityHistory);
  console.log(parsedCityHistory);
  if (parsedCityHistory){
  parsedCityHistory.forEach(cityButtonFactory);
  }
};


// add event listeners
citySearchButton.addEventListener("click", getCurrentWeatherHandler);
window.onload = loadSearchHistory;