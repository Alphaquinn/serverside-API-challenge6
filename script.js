const apiKey = "069760cb904c2be978ec2f3da1860237";
let citySearchHistory = JSON.parse(localStorage.getItem("cityHistory")) ||[];
let today = new Date().toLocaleDateString();
let currentCityLat;
let currentCityLon;
const citySearchButton = document.querySelector("#userCityButton");
const cityNameEl = document.querySelector("#userCityInput");
const cityHistoryColumnEl = document.querySelector("#cityHistory");
const currentCityWeatherEl = document.getElementById ("currentcityweather");
const fiveDayEl = document.querySelector("#fiveDay");

//APIBuilder

//"069760cb904c2be978ec2f3da1860237"

const GetCurrentWeatherHandler = function (event){
    currentCityWeatherEl.innerHTML="";
    const cityName = cityNameEl.value.trim();
    cityNameEl.value = "";
    APIBUILDER(cityName);

};
//currentWeatherApiUrl
const APIBUILDER = function(cityName){
    currentCityWeatherEl.innerHTML="currentcitweather";
    const currentWeatherAPIURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial" + "&appid=" + apiKey;
    console.log("current weather api:"+ currentWeatherAPIURL);
    fetch(currentWeatherAPIURL).then(function(response){
        if (response.ok){
            citySearchHandler(cityName);
            console.log(response);
            response.json().then(function(data){
                console.log("current weather data:");
                console.log(data);
                const currentCityName = document.createElement("h2");
                const currentCityTemperature = document.createElement("p");
                const currentCityHumidity = document.createElement("p");
                const currentCityWindspeed = document.createElement("p");


                currentCityName.textContent = `${data.name},${today}`;
                currentCityTemperature.textContent = `Temp: ${data.main.temp} feirennheit`;
                currentCityHumidity.textContent = `${data.main.humidity}%`;
                currentCityWindspeed.textContent = `${data.wind.speed}Mph`;


                currentCityWeatherEl.append(
                    currentCityName,
                    currentCityTemperature,
                    currentCityHumidity,
                    currentCityWindspeed
                );


                currentCityLat = data.coord.lat;
                currentCityLon = data.coord.lon;
                console.log(currentCityLat);
                console.log(currentCityLon);
                oneCallWeatherHandler();
    
            });
        }
    });
};



const oneCallWeatherHandler = function(){
    const OneCallAPIURL =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    currentCityLat +
    "&lon=" +
    currentCityLon +
    "&exclude=minutely,hourly&units=imperial&appid=" +
    apiKey;

    console.log("one call api:");
    console.log(OneCallAPIURL);
    fetch(OneCallAPIURL).then (function(response){
        console.log("one call response:" + response);
        response.json().then(function(data){
            console.log("one call data:");
            console.log(data);
            const currentcityUV = document.createElement("p");


            if (data.current.uvi < 3){
                currentcityUV.classList.add("uvLow");
            } else if (data.current.uvi>2 && data.current.uvi<8) {
                currentcityUV.classList.add("uvMed");
            }else {currentcityUV.classList.add("uvHigh");
        }
            currentcityUV.textContent= `UVI: ${data.current.uvi}`;
            currentCityWeatherEl.append(currentcityUV);
            fiveDayElHandler(data.daily);


        });
    });

};


const fiveDayElHandler = function(fiveDayData){
    fiveDayEl.innerHTML=""
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

var citySearchHandler = function(cityName){
    if (!citySearchHistory.includes(cityName)) {
        citySearchHistory.push(cityName);
        console.log(citySearchHistory);
        cityButtonFactory(cityName);
    }
    saveCity(citySearchHistory);
};



let saveCity = function(cityHistory){
    localStorage.setItem("cityHistory", JSON.stringify(cityHistory));
};


let loadCity = function(){
    let loadedCityName = localStorage.getItem("cityHistory");
    return JSON.parse(loadedCityName);
};




const cityButtonFactory = function (cityName){
    let citySearchHistoryEl = document.createElement("button");
    citySearchHistoryEl.type="button";
    citySearchHistoryEl.className = "btn btn-secondary btnMargin";
    citySearchHistoryEl.innerText = cityName;
    cityHistoryColumnEl.appendChild(citySearchHistoryEl);
    citySearchHistoryEl.addEventListener("click", ()=>APIBUILDER(cityName));


};


const loadSearchHistory = function() {
    const loadCityHistory = localStorage.getItem("cityHistory");
    const parsedCityHistory = JSON.parse(loadCityHistory);
    console.log(parsedCityHistory);
    if (parsedCityHistory) {
      parsedCityHistory.forEach(cityButtonFactory);
      }
    };
  

citySearchButton.addEventListener("click", GetCurrentWeatherHandler);
window.onload= loadSearchHistory;



//check lines 13-17 for citynames handler
    