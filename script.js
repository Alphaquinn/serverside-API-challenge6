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
    console.log("current weather api:")
}
