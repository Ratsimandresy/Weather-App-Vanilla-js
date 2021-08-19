//** kelvin to degree */
export const convertToDegree = (t) => {
  const result = Math.round(t - 273.15);
  return result;
};

//**get day by name */
export const getDay = (day) => {
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
export const getIconURL = (code) => {
  let URL = `http://openweathermap.org/img/wn/${code}@2x.png`;
  return URL;
};

const testFunction = () => {
  return "testing is going through";
};

export const secondTest = () => {
  return "second test here";
};

export default testFunction;
