// import tracer from "dd-trace";
// tracer.init();

//** SELECTING ALL THE ELEMENT NEEDED */
const selected = document.querySelector(".selected");
const optionsContainer = document.querySelector(".options-container");
const selectedText = document.querySelector(".selected-text");
const City = document.querySelector(".city");
const temperature = document.querySelector(".temp span");
const icon = document.querySelector(".currentWeatherIcon");
const forecast = document.querySelector(".forecast");
const days = document.querySelector(".days");
const searchBox = document.querySelector(".search-box");
const currentConditions = document.querySelector(".current");
const frag = document.createDocumentFragment();
let optionsList;

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
  optionsContainer.classList.toggle("active");
  //**allow the user to access immediately the input type field */
  if (optionsContainer.classList.contains("active")) {
    searchBox.focus();
    //**resetting the input */
    currentConditions.innerHTML = loadingCurrent;
    forecast.innerHTML = loadingForecast;
    days.innerHTML = "";
    searchBox.value = "";
  }
});

//**DISPLAYING THE CITIES */
const displayCities = (arr) => {
  arr.forEach((el) => {
    const { id, nm } = el;
    const option = document.createElement("div");
    const input = document.createElement("input");
    const label = document.createElement("label");

    option.appendChild(input);
    option.appendChild(label);
    option.setAttribute("class", "option");
    label.setAttribute("for", `${id}`);
    input.classList.add("radio");
    Object.assign(input, {
      type: "radio",
      name: `${nm}`,
      id: `${id}`,
    });

    label.textContent = `${nm}`;
    frag.appendChild(option); //**! perforamance, kind of virtual DOM when manipulating multiple DOM element like list li etc... */
    optionsContainer.appendChild(frag);
    optionsList = document.querySelectorAll(".option"); //**! i spent al lot of time here, it was always empty , defined outside the function */
  });
  //**selecting the city  */
  optionsList.forEach((option) => {
    option.firstElementChild.addEventListener("click", async () => {
      const text = option.querySelector("label").textContent; //**! event bubblingn-, fetch() called twice, needed to target the right DOM element */
      selectedText.textContent = text;
      City.textContent = text;
      optionsContainer.classList.remove("active");
      forecast.innerHTML = "";

      displayForecastInfo(text);
      displayCurrentWeather(text);
    });
  });
};

//**DISPLAYING FORECAST */
const displayForecastInfo = async (val) => {
  try {
    const forecastInfo = await fetchForecastInfo(val)
      .then((res) => res)
      .catch((err) => console.log(err));
    const { list } = forecastInfo;
    //**getting the the 5 days forecast*/
    const fiveDaysForecast = list.filter((el) => list.indexOf(el) % 8 == 1);

    //**getting the next 3 days */
    fiveDaysForecast.slice(0, 3).forEach((d) => {
      console.log("forecast info");
      const { temp_min, temp_max } = d.main;
      const { dt_txt } = d;
      const { icon, description } = d.weather[0];
      const url = getIconURL(icon);

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

//**DISPLAYING CURRENT WEATHER */
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

//**FETCHING THE CITIES */
const fetchCities = async () => {
  try {
    const response = await fetch("./data/cities-fr.json");
    //**    const response = await fetch("./data/fewCities.json"); // testing purpose
    if (response.ok) {
      const cities = await response
        .json()
        .then((res) => res)
        .catch((err) => console.log(err));
      console.log(cities);
      displayCities(cities);

      //**FILTERING INPUT */
      searchBox.addEventListener("keyup", (event) => {
        filterList(event.target.value);
      });

      //**this function is going to filter for each character typed, to lower case making ot case insensitive */
      const filterList = (input) => {
        input = input.toLowerCase();
        optionsList.forEach((option) => {
          //**targeting the label inside each options */
          let label =
            option.firstElementChild.nextElementSibling.innerText.toLowerCase();
          label.indexOf(input) !== -1
            ? (option.style.display = "block")
            : (option.style.display = "none");
        });
      };
    }
  } catch (error) {
    console.log(error);
  }
};
fetchCities();

//**FETCHING CURRENT WEATHER */
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

//**FILTERING INPUT */
searchBox.addEventListener("keyup", (event) => {
  filterList(event.target.value);
});

//**this function is going to filter for each character typed, to lower case making ot case insensitive */
const filterList = (input) => {
  input = input.toLowerCase();
  optionsList.forEach((option) => {
    //**targeting the label inside each options */
    let label =
      option.firstElementChild.nextElementSibling.innerText.toLowerCase();
    // console.log(label);
    label.indexOf(input) !== -1
      ? (option.style.display = "block")
      : (option.style.display = "none");
  });
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
