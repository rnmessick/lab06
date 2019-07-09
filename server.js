'use strict';
//Load Evn
require('dotenv').config();

const express = require('express');
const PORT = 3000;
const cors = require('cors');
const app = express();
app.use(cors());

//API Routes
app.get('/location', (request, response)=>{
  console.log(request.query);
  try{
    const locationData = searchToLatLng('Seattle');
    response.send(locationData)
  }catch(e){
    response.status(500).send('status 500: Sorry I am not working')
  }
})
app.get('/weather', (request, response)=>{
  console.log(request.query);
  try{
    const weatherData = searchWeather();
    response.send(weatherData)
  }catch(e){
    response.status(500).send('status 500: Sorry I am not working')
  }
})

app.use('*',(request,response)=>{
  response.send('you got to the wrong place')
})
function Location(geoData){
  this.formatted_query = geoData.results[0].formatted_address;
  this.latitude = geoData.results[0].geometry.location.lat;
  this.longitude = geoData.results[0].geometry.location.lng;
}
function Weather(weatherData){
  this.forecast = weatherData.summary;
  let weatherTime = weatherData.time;
  this.time = new Date(weatherTime)
}
function searchWeather(weatherQuery){
  const weatherArr = [];
  const darkSkyData = require('./data/darksky.json');
  darkSkyData.daily.data.forEach(day =>{
    weatherArr.push(new Weather(day));
  })
  weatherArr.search_query = weatherQuery;
  return weatherArr;
}

function searchToLatLng(query){
  const geoData = require('./data/geo.json');
  const location = new Location(geoData);
  location.search_query = query;
  return location;
}

app.listen(PORT, ()=> console.log(`app is on port ${PORT}`));
