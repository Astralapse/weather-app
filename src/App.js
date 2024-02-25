import React from "react";
import axios from "axios";
import ShortInfo from "./components/ShortInfo";
import DetailInfo from "./components/DetailInfo";
import Loader from "./components/Loader";
function App() {
  const [userGeo, setUserGeo] = React.useState({});
  const [weatherInfo, setWeatherInfo] = React.useState({});
  const [timeInfo, setTimeInfo] = React.useState({});
  const [fullWeatherDay, setFullWeatherDay] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(true);

  const getLocationKey = async (userCity) => {
    try {
      const key = await axios.get(
        `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=	ZvQSqYj17aiaTSo8fIlkrUSFdA3hPLLG&q=${userCity}`
      );
      return key.data[0].Key;
    } catch (error) {
      alert("Error when receiving a location key");
      console.error("Error when receiving a location key:", error);
    }
  };

  React.useEffect(() => {
    async function fetchData() {
      try {
        const coords = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (geoObj) => resolve(geoObj.coords),
            (error) => reject(error)
          );
        });
        const userGeoObj = await axios.get(
          `https://api.geoapify.com/v1/geocode/reverse?lat=${coords.latitude}&lon=${coords.longitude}&apiKey=21476916bb304f32be3acfb280953f98`
        );
        setUserGeo({
          city: userGeoObj.data.features[0].properties.city,
          country: userGeoObj.data.features[0].properties.country,
          timezone: userGeoObj.data.features[0].properties.timezone.name,
        });
        setTimeout(() => setIsLoading(false), 2000);
      } catch (error) {
        alert("Error when retrieving user location");
        console.error("Error when retrieving user location:", error);
      }
    }
    fetchData();
  }, []);
  return (
    <div className="wrapper d-flex">
      {isLoading ? <Loader /> : null}

      <ShortInfo
        weatherInfo={weatherInfo}
        timeInfo={timeInfo}
        userGeo={userGeo}
        fullWeatherDay={fullWeatherDay}
        getLocationKey={getLocationKey}
        setUserGeo={setUserGeo}
        setWeatherInfo={setWeatherInfo}
        setTimeInfo={setTimeInfo}
        setIsLoading={setIsLoading}
      />
      <DetailInfo
        weatherInfo={weatherInfo}
        timezone={timeInfo.timezone}
        userGeo={userGeo}
        fullWeatherDay={fullWeatherDay}
        getLocationKey={getLocationKey}
        setFullWeatherDay={setFullWeatherDay}
        setIsLoading={setIsLoading}
      />
    </div>
  );
}

export default App;
