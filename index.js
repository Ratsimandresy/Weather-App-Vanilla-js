//** SELECTING ALL THE ELEMENT NEEDED */
const selected = document.querySelector(".selected");
const optionsContainer = document.querySelector(".options-container");
const selectedText = document.querySelector(".selected-text");
const City = document.querySelector(".city");
const temperature = document.querySelector(".temp span");
const icon = document.querySelector(".currentWeatherIcon");
const forecast = document.querySelector(".forecast");
const days = document.querySelector(".days");
const optionsList = document.querySelectorAll(".option");
const searchBox = document.querySelector(".search-box");
const currentConditions = document.querySelector(".current");
console.log(temperature);
const loadingForecast = `
<div>
<div class="wi"></div>
<p>
  <img src="./image/loading.gif" alt="loading.." />
</p>
<p>
  <img src="./image/loading.gif" alt="loading.." />
</p>
</div>
<div>
<div class="wi"></div>
<p>
  <img src="./image/loading.gif" alt="loading.." />
</p>
<p>
  <img src="./image/loading.gif" alt="loading.." />
</p>
</div>
<div>
<div class="wi"></div>
<p>
  <img src="./image/loading.gif" alt="loading.." />
</p>
<p>
  <img src="./image/loading.gif" alt="loading.." />
</p>
</div>
`;

const loadingCurrent = `
<div class="currentWeatherIcon wi">
<img src="./image/loading.gif" alt="loading.." />
</div>
<div class="temp">
<img src="./image/loading.gif" alt="loading.." />
</div>
`;

//** ADDING SOME EVENT LISTENER */
selected.addEventListener("click", () => {
  // fetchCities();
  optionsContainer.classList.toggle("active");
  //**allow the user to access immediately the input type field */
  if (optionsContainer.classList.contains("active")) {
    searchBox.focus();
    //**resetting the input */

    currentConditions.innerHTML = loadingCurrent;
    forecast.innerHTML = loadingForecast;
    days.innerHTML = "";
    searchBox.value = "";
    filterList("");
  } else {
    forecast.innerHTML = "";
    // currentConditions.innerHTML = "";
  }
});
//**selecting the city  */

optionsList.forEach((option) => {
  console.log("before clicking");
  option.firstElementChild.addEventListener("click", async () => {
    console.log("INPUT CLICKED");
    const text = option.querySelector("label").textContent;
    selectedText.textContent = text;
    City.textContent = text;

    optionsContainer.classList.remove("active");

    // currentConditions.innerHTML = "";
    forecast.innerHTML = "";

    displayForecastInfo(text);
    displayCurrentWeather(text);
  });
});

//**FILTERING INPUT */
searchBox.addEventListener("keyup", (event) => {
  filterList(event.target.value);
});

//**this function is going to filter for each character typed, to lower case making ot case insensitive */
const filterList = (input) => {
  input = input.toLowerCase();
  optionsList.forEach((option) => {
    //**targeting the label inside each options */
    let label = option.firstElementChild.nextElementSibling.innerText.toLowerCase();
    // console.log(label);
    label.indexOf(input) !== -1
      ? (option.style.display = "block")
      : (option.style.display = "none");
  });
};

//**FETCHING THE DATA */
// const fetchCities = async () => {
//   console.log("fetching cities");
//   try {
//     const response = await fetch("/fewCities.json");

//     let cities = await response
//       .json()
//       .then((res) => res)
//       .catch((err) => console.log(err));

//     cities.forEach((city) => {
//       const { id, nm } = city;
//       return (optionsContainer.innerHTML += `
//     <div class="option">
// <input type="radio" class="radio" name="city" id=${id} />
// <label for=${id}>${nm}</label>
//   </div>
//     `);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

//**!---------TEsT------------ */

// let cities = [];

// const fetchCities = () => {
//   fetch("/fewCities.json")
//     .then((res) => {
//       res.json().then((res) => {
//         cities = res;
//         // console.log({ cities });
//         showCities(cities);
//       });
//     })
//     .catch((err) => console.log(err));
// };

// fetchCities();
// document.addEventListener("DOMContentLoaded", fetchCities);

// const showCities = (arr) => {
//   let output = "";

//   arr.forEach(({ id, nm }) => {
//     output += `
//       <div class="option">
//               <input type="radio" class="radio" name="city" id=${id} />
//                <label for=${id}>${nm}</label>
//     </div>
//       `;
//   });
//   optionsContainer.innerHTML = output;
// };

// searchBox.addEventListener("input", (e) => {
//   const el = e.target.value.toLowerCase();
//   console.log(cities);
//   let newCity = cities.filter((city) => {
//     city.nm.toLowerCase().includes(el);
//   });
//   console.log(newCity);
//   showCities(newCity);
// });

//**!---------TEsT------------ */

//**FETCHING CURRENT WEATHER */

const displayCurrentWeather = async (val) => {
  try {
    const currentInfo = await fetchCurrentWeather(val)
      .then((res) => res)
      .catch((err) => console.log(err));
    const { main, weather } = currentInfo;
    const temp = convertToDegree(main["temp"]);
    const { icon, description } = weather[0];
    const url = getIconURL(icon);

    return (currentConditions.innerHTML = `
    <div class="currentWeatherIcon wi">
    <img src=${url} atl=${description} style="width:250px;height:250px;position:absolute;top:-60px;left:-130px;"/>
    </div>
    <div class="temp2">
      <p><span>${temp}</span>°</p>
    </div>
    `);
  } catch (err) {
    console.log(err);
  }
};

const fetchCurrentWeather = async (val) => {
  try {
    const info = fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${val}&appid=cafd00df9787dfea7ce7af4c4aa0ddf7`
    )
      .then((res) => res.json())
      .catch((err) => console.log(err));

    return info;
  } catch (err) {
    console.log(err);
  }
};

//**FETCHING FORECAST */

const displayForecastInfo = async (val) => {
  try {
    const forecastInfo = await fetchForecastInfo(val)
      .then((res) => res)
      .catch((err) => console.log(err));

    const { list } = forecastInfo;

    const fiveDaysForecast = list.filter((el) => list.indexOf(el) % 8 == 1);
    console.log(fiveDaysForecast);
    fiveDaysForecast.slice(0, 3).forEach((d) => {
      const { temp_min, temp_max } = d.main;
      const { dt_txt } = d;
      const { icon, description } = d.weather[0];
      // console.log(icon);
      const url = getIconURL(icon);
      // console.log(url);

      return (
        (days.innerHTML += ` <div>${getDay(dt_txt)}</div>`),
        (forecast.innerHTML += `         <div>
    <div class="wi">
      <img src=${url} atl=${description} style="height:40px;width:40px"/>
    </div>
    <p><span>${convertToDegree(temp_max)}</span>°</p>
     <p><span>${convertToDegree(temp_min)}</span>°</p>
  </div>`)
      );
    });
  } catch (error) {
    console.log(error);
  }
};

const fetchForecastInfo = async (val) => {
  try {
    const info = fetch(
      `http://api.openweathermap.org/data/2.5/forecast?q=${val}&appid=cafd00df9787dfea7ce7af4c4aa0ddf7`
    )
      .then((res) => res.json())
      .catch((err) => console.log(err));

    return info;
  } catch (err) {
    console.log(err);
  }
};

//** kelvin to degree */
const convertToDegree = (t) => {
  const result = Math.round(t - 273.15);
  return result;
};

//**get day by name */
const getDay = (day) => {
  let d = new Date(day);
  var weekday = new Array(7);
  weekday[0] = "Sun";
  weekday[1] = "Mon";
  weekday[2] = "Tue";
  weekday[3] = "Wed";
  weekday[4] = "Thu";
  weekday[5] = "Fri";
  weekday[6] = "Sat";

  var n = weekday[d.getDay()];
  return n;
};

//**generate weather icons */
const getIconURL = (code) => {
  let URL = `http://openweathermap.org/img/wn/${code}@2x.png`;
  return URL;
};

//**CACHE  */

function loadCached(url) {
  let cache = loadCached.cache || (loadCached.cache = new Map());
  let promise;

  if (cache.has(url)) {
    promise = cache.get(url);
  } else {
    promise = fetch(url);
    cache.set(url, promise);
  }

  return promise.then((response) => response.text());
}
