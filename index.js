//** SELCTING ALL THE ELEMENT NEEDED */
const selected = document.querySelector(".selected");
const optionsContainer = document.querySelector(".options-container");
const optionsList = document.querySelectorAll(".option");
const selectedText = document.querySelector(".selected-text");
const searchBox = document.querySelector(".search-box input");

console.log(optionsList);

//** ADDING SOME EVENT LISTENER */
selected.addEventListener("click", () => {
  optionsContainer.classList.toggle("active");
  //**allow the user to access immediately the input type field */
  if (optionsContainer.classList.contains("active")) {
    searchBox.focus();
    //**resetting the input */
    searchBox.value = "";
    filterList("");
  }
});

//**selecting the city  */
optionsList.forEach((option) => {
  option.addEventListener("click", () => {
    selectedText.textContent = option.querySelector("label").textContent;
    optionsContainer.classList.remove("active");
  });
});

searchBox.addEventListener("keyup", (event) => {
  filterList(event.target.value);
});

//**this function is going to filter for each character typed, to lower case making ot case insensitive */
const filterList = (searchedWord) => {
  searchedWord = searchedWord.toLowerCase();
  optionsList.forEach((option) => {
    //**targeting the label inside each options */
    let label = option.firstElementChild.nextElementSibling.innerText.toLowerCase();

    label.indexOf(searchedWord) !== -1
      ? (option.style.display = "block")
      : (option.style.display = "none");
  });
};

//**FETCHING THE DATA */
const fetchCities = async () => {
  try {
    const response1 = await fetch("/fewCities.json");
    const cities = response1.json();
    let response2 = await cities
      .then((res) => res)
      .catch((err) => console.log(err));
    console.log(response2);
    response2.forEach((city) => {
      const { nm } = city;
      return (optionsContainer.innerHTML += `
    <div class="option">
      <input type="radio" class="radio" name="city" id=${nm} />
      <label for=${nm}>${nm}</label>
  </div>
    `);
    });
  } catch (error) {
    console.log(error);
  }
};

const fetchCurrentWeather = async () => {
  try {
    const response = await fetch(
      "http://api.openweathermap.org/data/2.5/weather?q=Arcueil&appid=cafd00df9787dfea7ce7af4c4aa0ddf7"
    );
    const currentWeather = response.json();
    // console.log(currentWeather);
    return getData(currentWeather);
  } catch (error) {
    console.log(error);
  }
};

const fetchForecast = async () => {
  try {
    const response = await fetch(
      "http://api.openweathermap.org/data/2.5/forecast?q=Arcueil&appid=cafd00df9787dfea7ce7af4c4aa0ddf7"
    );
    const forecast = response.json();
    // console.log(forecast);
    return getData(forecast);
  } catch (error) {
    console.log(error);
  }
};

//** handle the promise return by these fetching functions above, thus returning the data needed */
function getData(data) {
  if (data) {
    data
      .then((res) => {
        // console.log("HEREEEEEE IS RES", res);
        return res;
      })
      .catch((err) => console.log(err));
  } else {
    return alert("error from data fetching");
  }
}

fetchCities();
// fetchCurrentWeather();
// console.log(fetchCurrentWeather())
// fetchForecast();
// console.log(fetchForecast())

//**POPULATE THE OPTIONS WITH ALL THE CITIES */

// const allCities = fetchCities();
// allCities.forEach((city) => {
//   console.log(city);
// });
