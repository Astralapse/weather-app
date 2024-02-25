import React from "react";
import styles from "./DetailInfo.module.scss";
import axios from "axios";
import Card from "../Card";
function DetailInfo({
  timezone,
  userGeo,
  fullWeatherDay,
  setFullWeatherDay,
  getLocationKey,
}) {
  const [currentDay, setCurrentDay] = React.useState(0);
  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday ",
  ];
  const moment = require("moment-timezone");
  const nowInNY = moment().tz(timezone);

  const getFullWeatherDay = async (weekDayNumber, city) => {
    try {
      const key = await getLocationKey(city);
      const weatherForFiveDays = await axios.get(
        `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${key}?apikey=	ZvQSqYj17aiaTSo8fIlkrUSFdA3hPLLG&language=en-us&metric=true&details=true`
      );
      setCurrentDay(weekDayNumber);
      setFullWeatherDay(weatherForFiveDays.data.DailyForecasts[weekDayNumber]);
    } catch (error) {
      alert("Error when receiving the weather for the whole day");
      console.error(
        "Error when receiving the weather for the whole day:",
        error
      );
    }
  };

  const getWeekDays = () => {
    const currentWeekDays = [];
    let counter = nowInNY?.isoWeekday();
    for (let i = 0; i < 5; i++) {
      currentWeekDays.push(weekDays[(counter - 1) % 7]);
      counter += 1;
    }
    return currentWeekDays;
  };
  React.useEffect(() => {
    if (userGeo.city) {
      getFullWeatherDay(0, userGeo.city);
    }
  }, [userGeo]);
  return (
    <>
      <div className={styles.detailInfo}>
        <div className="d-flex align-center mb-50">
          <ul className={styles.days}>
            {getWeekDays().map((weekDay, index) => {
              if (currentDay === index) {
                return (
                  <li
                    className={styles.active}
                    key={index}
                    onClick={() => getFullWeatherDay(index, userGeo.city)}
                  >
                    <img src="img/day.svg" alt="" />
                    {weekDay}
                  </li>
                );
              } else {
                return (
                  <li
                    key={index}
                    onClick={() => getFullWeatherDay(index, userGeo.city)}
                  >
                    {weekDay}
                  </li>
                );
              }
            })}
          </ul>
        </div>

        <div className="d-flex flex-wrap">
          <Card
            title={"Wind"}
            info1={`${fullWeatherDay?.Day?.Wind.Speed.Value} Km/h`}
            info2={`${fullWeatherDay?.Night?.Wind.Speed.Value} Km/h`}
            titleIcon={"wind"}
            icon1={"sun"}
            icon2={"moon"}
          />
          <Card
            title={"Humidity"}
            info1={`${fullWeatherDay?.Day?.RelativeHumidity.Average} %`}
            info2={`${fullWeatherDay?.Night?.RelativeHumidity.Average} %`}
            titleIcon={"water"}
            icon1={"sun"}
            icon2={"moon"}
          />

          <Card
            title={"Rain probability"}
            info1={`${fullWeatherDay?.Day?.RainProbability} %`}
            info2={`${fullWeatherDay?.Night?.RainProbability} %`}
            titleIcon={"cloud-light-rain"}
            icon1={"sun"}
            icon2={"moon"}
          />

          <Card
            title={"Temperature"}
            info1={`${fullWeatherDay?.Temperature?.Maximum.Value} °C`}
            info2={`${fullWeatherDay?.Temperature?.Minimum.Value} °C`}
            titleIcon={"thermometer"}
            icon1={"up-arrow-alt"}
            icon2={"down-arrow-alt"}
            titleIconType="solid"
            icon1Type="solid"
            icon2Type="solid"
          />
          {fullWeatherDay?.AirAndPollen && (
            <Card
              title={"UVIndex"}
              info1={`${
                fullWeatherDay?.AirAndPollen[
                  fullWeatherDay.AirAndPollen.length - 1
                ]?.Value
              }`}
              info2={`${
                fullWeatherDay?.AirAndPollen[
                  fullWeatherDay.AirAndPollen.length - 1
                ]?.Category
              }`}
              titleIcon={"sun"}
              hasIcon={false}
            />
          )}

          {fullWeatherDay?.AirAndPollen && (
            <Card
              title={"Air Quality"}
              info1={`${fullWeatherDay?.AirAndPollen[0]?.Value}`}
              info2={`${fullWeatherDay?.AirAndPollen[0]?.Category}`}
              titleIcon={"leaf"}
              hasIcon={false}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default DetailInfo;
