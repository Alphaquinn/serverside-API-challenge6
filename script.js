var apiKey= "069760cb904c2be978ec2f3da1860237";
let citySearchHistory = JSON.parse(localStorage.getItem("#cityHistory")) ||[];
let today = new Date().toLocaleDateString();
let currentcitylat;
let currentcitylon;
const citysearchbutton= document.querySelector("#userCitybutton");
const citynameEl= document.querySelector("userCityInput");
const cityHistoryColumnEl = document.querySelector("#cityHistory");
const currentcityWeatherEl = document.getElementById ("#currentcityweather");
const fivedayEl = document.querySelector("#5day");


const getcurrentweatherhandler = function (event){
    currentcityWeatherEl.innerHTML="";
    const cityname = citynameEl.value.trim();
    cityname.value = "";
    APIBUILDER(cityname);

};

const APIBUILDER = function(cityname){
    currentcityWeatherEl.innerHTML="";
    const currentweatherAPIURL = "http://api.openweathermap.org/data/2.5/weather?q=" +
    cityName + "&units=imperial" + "&appid=" +
    apiKey;
    console.log("current weather api:"+ currentweatherAPIURL);
    fetch(currentweatherAPIURL).then(function(response){
        if (response.ok){
            citysearchhandler(cityname);
            console.log(response);
            response.json().then(function(data){
                console.log("current weather data");
                console.log(data);
                const currentcityname = document.createElement("h2");
                const currentcitytemperature = document.createElement("p");
                const currentcityhumidity = document.createElement("p");
                const currentcitywindspeed = document.createElement("p");


                currentcityname.textContent = `${data.name},${today}`;
                currentcitytemperature.textContent = `Temp: ${data.main.temp} feirennheit`;
                currentcityhumidity.textContent = `${data.main.humidity}%`;
                currentcitywindspeed.textcontent = `${data.wind.speed}Mph`;


                currentcityWeatherEl.append(
                    currentcityname,
                    currentcitytemperature,
                    currentcityhumidity,
                    currentcitywindspeed
                );


                currentcitylat = data.coord.lat;
                currentcitylon = data.coord.lon;
                console.log(currentcitylat);
                console.log(currentcitylon);
                SingleCallWeatherHandler();
    
            });
        }
    });
};


const SingleCallWeatherHandler = function(){
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


            if (data.current.uvi<3){
                currentcityUV.classList.add("low UV");
            } else if (data.current.uvi>2 && data.current.uvi<8) {
                currentcityUV.classlist.add("med UV");
            }else {currentcityUV.classlist.add("high UV");
        }
            currentcityUV.textcontent= `UVI: ${data.current.uvi}`;
            currentcityWeatherEl.append(currentcityUV);
            fivedayElhandler(data.daily);


        });
    });

};


const fivedayElhandler = function(fivedaydata){
    fivedayEl.innerHTML=""
    for (let i=1; i<6; i++){
        let newDate = new Date(fivedaydata[i].dt*1000).toLocaleDateString("en-US")
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

    