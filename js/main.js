

const searchInput = document.querySelector('.search-input')
const cityList = document.querySelector('.city-list')
const searchBtn = document.querySelector('.search-btn')
const title = document.querySelector('.title')
const weatherHolder = document.querySelector('.weather-holder')
const form = document.querySelector('.search-city-form')
const weather = document.querySelector('.weather')
const openContactsWindow = document.querySelector('.open-window')
const closeContactsWindow = document.querySelector('.close-window')
const contactsWindow = document.querySelector('.contacts-window')
const apiKey = '82cee5f348a14079bd3131801230511'
const cities = []








fetch('./cities.json')
    .then(res => res.json())
    .then(data => {
        data.city.forEach(city => {
            cities.push(city)
        })
    })


function getCities(word, cities) {
    const filtredCities = []
    if (word === '') {
        return ''
    }

    for (city of cities) {
        if (filtredCities.length === 6) return filtredCities
        if (city.name.toLowerCase().startsWith(word.toLowerCase())) {
            filtredCities.push(city.name)
        }
    }

    return filtredCities
}

function checkStr(str, value) {
    if (str.includes('-')) {
        const regex = new RegExp(`(${value})`, "i");
        return str.replace(regex, '<span><strong>$1</strong></span>');
    } else {
        return str.toLowerCase().replace(value.toLowerCase(), `<span><strong>${value[0].toUpperCase()}${value.slice(1).toLowerCase()}</strong><span>`)
    }

}





searchInput.addEventListener('input', (elem) => {
    const elemValue = elem.target.value;
    const filteredCities = getCities(elemValue, cities);
    if (elemValue !== '') {
        const cityElem = filteredCities.map(city => {
            return `<li class="city">${checkStr(city, elemValue)}</li>`;
        }).join('');

        cityList.innerHTML = cityElem;

        const cityItems = cityList.querySelectorAll('.city'); // Выбираем все элементы с классом 'city'
        cityItems.forEach(cityItem => {
            cityItem.addEventListener('click', () => {
                const selectedCity = cityItem.textContent;
                searchInput.value = selectedCity;
                cityList.innerHTML = ''; // Скрываем список после выбора города
            });
        });
    } else {
        cityList.innerHTML = '';
    }
});


searchBtn.addEventListener('click', () => {
    const searchCity = document.querySelector('.search-city')
    cityList.innerHTML = ''
    searchCity.style.width = 0
    title.style.opacity = 0;
    setTimeout(() => {
        searchCity.style.opacity = 0;
    }, 200);

    setTimeout(() => {
        title.style.display = 'none'
        searchCity.style.display = 'none'
    }, 1000);


    setTimeout(() => {
        weatherHolder.style.display = 'flex'
    }, 1000)



    setTimeout(() => {
        weatherHolder.style.opacity = 1
        weatherHolder.style.width = '50%'
        weatherHolder.style.height = '85%'
    }, 1200)



})


function getWeather(weatherList, weatherCode, isDay) {
    console.log(weatherList)
    for (weath of weatherList) {
        if (weath.code === weatherCode) return (isDay === 1) ? weath.languages[23].day_text : weath.languages[23].night_text
    }
}

function getWeatherIcon(weatherList, weatherCode, isDay) {
    for (weath of weatherList) {
        console.log(weath)
        if (weath.code === weatherCode) return (isDay === 1) ? weath.day : weath.night
    }
}


form.onsubmit = function (e) {
    e.preventDefault();
    city = searchInput.value.trim()
    setTimeout(() => {
        weather.style.opacity = 1
        weather.style.right = 0
    }, 1500)


    fetch('https://www.weatherapi.com/docs/conditions.json')
        .then(response => response.json())
        .then(data1 => {
            return { data1 };
        })
        .then(({ data1 }) => {
            // Выполняем второй запрос, используя данные из первого запроса
            return fetch(`http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}`)
                .then(response2 => response2.json())
                .then(data2 => ({ data1, data2 })); // Возвращаем объект с данными из обоих запросов
        })
        .then(({ data1, data2 }) => {
            console.log(data2)
            // Обработка данных из второго запроса, а также использование данных из первого запроса (data1)
            const html = `<h1 class="city-name">${data2.location.name}</h1>
                 <button class="change-city">Сменить город</button>
                 <img class="weather-icon" src="/images/${(data2.current.is_day === 1) ? 'day' : 'night'}/${getWeatherIcon(data1, data2.current.condition.code, data2.current.is_day)}.svg" alt="">
                 <h1 class="temperature">${Math.floor(data2.current.temp_c)}°</h1>
                 <span class="condition">${getWeather(data1, data2.current.condition.code, data2.current.is_day)}</span>
                 <span class="feels-like">Ощущается как ${Math.floor(data2.current.feelslike_c)}°</span>
                 <div class="weather-details">
                    <div class="humidity">
                        <i class='bx bx-water'></i>
                        <div class="text">
                            <div class="info-humidity">
                                <span>${data2.current.humidity}%</span>
                            </div>
                            <p>Влажность</p>
                        </div>
                    </div>

                    <div class="wind">
                        <i class='bx bx-wind'></i>
                        <div class="text">
                            <div class="info-wind">
                                <span>${data2.current.wind_kph}Km/h</span>
                            </div>
                            <p>Скорость ветра</p>
                        </div>
                    </div>
                 </div>`;

            weather.innerHTML = html;

            const changeCityBtn = document.querySelector('.change-city')
            changeCityBtn.addEventListener('click', () => {
                const searchCity = document.querySelector('.search-city')
                searchInput.value = ''
                weather.style.right = '220px'
                weather.style.opacity = 0
                setTimeout(() => {
                    weatherHolder.style.width = 0
                    weatherHolder.style.height = 0
                    weather.innerHTML = ''
                }, 1000)

                setTimeout(() => {
                    weatherHolder.style.display = 'none'
                    searchCity.style.display = 'block'
                }, 1900)


                setTimeout(() => {
                    searchCity.style.width = '38%'
                    searchCity.style.opacity = 1
                }, 2100);

                setTimeout(() => {
                    title.style.display = 'block'
                    title.style.opacity = 0
                }, 2100)

                setTimeout(() => {
                    title.style.opacity = 1
                }, 2300)
            })
        })

}

openContactsWindow.addEventListener('click', (e) => {
    e.preventDefault()
    contactsWindow.classList.add('active')
})


closeContactsWindow.addEventListener('click', () => {
    contactsWindow.classList.remove('active')
})







