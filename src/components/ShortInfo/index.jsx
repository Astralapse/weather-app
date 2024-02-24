import React from "react";
import axios from "axios";
import styles from "./ShortInfo.module.scss";

function ShortInfo({
  weatherInfo,
  timeInfo,
  userGeo,
  fullWeatherDay,
  setWeatherInfo,
  setTimeInfo,
  setUserGeo,
  getLocationKey,
}) {
  const [searchValue, setSearchValue] = React.useState("");

  const moment = require("moment-timezone");
  const nowInNY = moment().tz(userGeo.timezone);
  const nextDate = moment(fullWeatherDay?.Date);
  const changeCity = async (userCity) => {
    const userGeoObj = await axios.get(
      `https://api.geoapify.com/v1/geocode/search?text=${userCity}&lang=en&limit=10&type=city&apiKey=21476916bb304f32be3acfb280953f98`
    );
    setUserGeo({
      city: userGeoObj.data.features[0].properties.city,
      country: userGeoObj.data.features[0].properties.country,
      timezone: userGeoObj.data.features[0].properties.timezone.name,
    });
  };

  const onChangeSearchInput = (event) => {
    setSearchValue(event.target.value);
  };

  const getWeatherInfo = async (city) => {
    const key = await getLocationKey(city);
    const response = await axios.get(
      `https://dataservice.accuweather.com/forecasts/v1/hourly/1hour/${key}?apikey=UUSrlxkiIq0KBzZB5tUHr874saAa3TPk&language=en-us&metric=true&details=true`
    );
    setWeatherInfo(response.data);
  };

  React.useEffect(() => {
    if (userGeo.city) {
      getWeatherInfo(userGeo.city);
      setTimeInfo({
        currentDay: nowInNY.format("DD"),
        currentMonth: nowInNY.format("MMMM"),
        currentYear: nowInNY.format("YYYY"),
        currentTime: nowInNY.format("HH:mm"),
        currentWeekDay: nowInNY.format("dddd"),
        timezone: userGeo.timezone,
      });
    }
  }, [userGeo]);
  return (
    <>
      <div className={styles.shortInfo}>
        <div className="d-flex flex-column align-center">
          <div className={styles.searchBlock}>
            <input
              onChange={onChangeSearchInput}
              value={searchValue}
              placeholder="Поиск..."
              type="text"
            />
            <box-icon
              onClick={() => changeCity(searchValue)}
              name="search"
            ></box-icon>
          </div>
          {Number(nextDate.date()) === Number(nowInNY?.format("DD")) ? (
            <>
              <img
                width={178}
                src={`img/weather-images/${
                  weatherInfo[0]?.IsDaylight ? "day" : "night"
                }/${weatherInfo[0]?.IconPhrase}.svg`}
                alt=""
              />
              <h2>{weatherInfo[0]?.Temperature?.Value}°C</h2>
              <p className={styles.weatherDescp}>
                {weatherInfo[0]?.IconPhrase}
              </p>
              <div className={styles.line}></div>
              <p className="mb-10">{`${timeInfo.currentDay} ${timeInfo.currentMonth} ${timeInfo.currentYear}`}</p>
              <p className={styles.day}>
                {`${timeInfo.currentWeekDay} ${timeInfo.currentTime}`}
              </p>
              <p className={styles.dayInfo}>
                {weatherInfo[0]?.IsDaylight ? "Day" : "Night"}
              </p>
              <h1
                className={styles.city}
              >{`${userGeo.city}, ${userGeo.country}`}</h1>
            </>
          ) : (
            <>
              <img
                width={178}
                src={`img/weather-images/day/${fullWeatherDay.Day?.IconPhrase}.svg`}
                alt=""
              />
              <h2>{fullWeatherDay.Temperature?.Maximum?.Value}°C</h2>
              <p className={styles.weatherDescp}>
                {fullWeatherDay.Day?.IconPhrase}
              </p>
              <div className={styles.line}></div>
              <p className="mb-10">{`${nextDate.date()} ${nextDate.format(
                "MMMM"
              )} ${nextDate.year()}`}</p>
              <p className={styles.day}>{`${nextDate.format("dddd")}`}</p>
              <p className={styles.dayInfo}>Day</p>
              <h1
                className={styles.city}
              >{`${userGeo.city}, ${userGeo.country}`}</h1>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default ShortInfo;
