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

//** ADDING SOME EVENT LISTENER */
selected.addEventListener("click", () => {
  // fetchCities();
  optionsContainer.classList.toggle("active");
  //**allow the user to access immediately the input type field */
  if (optionsContainer.classList.contains("active")) {
    searchBox.focus();
    //**resetting the input */
    forecast.innerHTML = "";
    days.innerHTML = "";
    searchBox.value = "";
    filterList("");
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

    fetchCurrentWeather(text);

    displayInfo(text);
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
    console.log(label);
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

const fetchCurrentWeather = async (val) => {
  try {
    const res1 = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${val}&appid=cafd00df9787dfea7ce7af4c4aa0ddf7`
    );

    const res2 = await res1
      .json()
      .then((res) => res)
      .catch((err) => console.log(err));
    // console.log({ res2 });

    const temp = convertToDegree(res2["main"]["temp"]);
    const weatherIcon = res2["weather"][0]["icon"];
    // const iconURL = `http://openweathermap.org/img/w/${weatherIcon}.png`;
    // console.log(weatherIcon);

    return (temperature.textContent = temp);
    // (icon.innerHTML = `<img src=${iconURL} alt="weather icon />`)
  } catch (err) {
    console.log(err);
  }
};

//**FETCHING FORECAST */

const displayInfo = async (val) => {
  const forecastInfo = await fetchForecastInfo(val)
    .then((res) => res)
    .catch((err) => console.log(err));

  const { list } = forecastInfo;

  const fiveDaysForecast = list.filter((el) => list.indexOf(el) % 8 == 1);

  fiveDaysForecast.slice(0, 3).forEach((d) => {
    const { temp_min, temp_max } = d.main;
    const { dt_txt } = d;

    return (
      (days.innerHTML += ` <div>${getDay(dt_txt)}</div>`),
      (forecast.innerHTML += `         <div>
    <div class="wi"></div>
    <p><span>${convertToDegree(temp_max)}</span>°</p>
     <p><span>${convertToDegree(temp_min)}</span>°</p>
  </div>`)
    );
  });
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
