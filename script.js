const cityInput =
    document.getElementById("cityInput");

const searchBtn =
    document.getElementById("searchBtn");

const locationBtn =
    document.getElementById("locationBtn");

const refreshBtn =
    document.getElementById("refreshBtn");

const message =
    document.getElementById("message");

const loading =
    document.getElementById("loading");

const weatherContent =
    document.getElementById("weatherContent");


/* CURRENT WEATHER ELEMENTS */

const cityName =
    document.getElementById("cityName");

const countryName =
    document.getElementById("countryName");

const currentDate =
    document.getElementById("currentDate");

const localTime =
    document.getElementById("localTime");

const weatherIcon =
    document.getElementById("weatherIcon");

const temperature =
    document.getElementById("temperature");

const weatherCondition =
    document.getElementById("weatherCondition");

const feelsLike =
    document.getElementById("feelsLike");

const humidity =
    document.getElementById("humidity");

const windSpeed =
    document.getElementById("windSpeed");

const rainChance =
    document.getElementById("rainChance");

const uvIndex =
    document.getElementById("uvIndex");

const sunrise =
    document.getElementById("sunrise");

const sunset =
    document.getElementById("sunset");

const forecast =
    document.getElementById("forecast");


/* CURRENT LOCATION DATA */

let currentLocation = null;


/* WEATHER CODE INFORMATION */

function getWeatherInfo(code) {

    const weatherCodes = {

        0: {
            text: "Clear Sky",
            icon: "☀️"
        },

        1: {
            text: "Mainly Clear",
            icon: "🌤️"
        },

        2: {
            text: "Partly Cloudy",
            icon: "⛅"
        },

        3: {
            text: "Overcast",
            icon: "☁️"
        },

        45: {
            text: "Fog",
            icon: "🌫️"
        },

        48: {
            text: "Rime Fog",
            icon: "🌫️"
        },

        51: {
            text: "Light Drizzle",
            icon: "🌦️"
        },

        53: {
            text: "Moderate Drizzle",
            icon: "🌦️"
        },

        55: {
            text: "Dense Drizzle",
            icon: "🌧️"
        },

        61: {
            text: "Light Rain",
            icon: "🌦️"
        },

        63: {
            text: "Moderate Rain",
            icon: "🌧️"
        },

        65: {
            text: "Heavy Rain",
            icon: "🌧️"
        },

        71: {
            text: "Light Snow",
            icon: "🌨️"
        },

        73: {
            text: "Moderate Snow",
            icon: "❄️"
        },

        75: {
            text: "Heavy Snow",
            icon: "❄️"
        },

        77: {
            text: "Snow Grains",
            icon: "❄️"
        },

        80: {
            text: "Light Showers",
            icon: "🌦️"
        },

        81: {
            text: "Moderate Showers",
            icon: "🌧️"
        },

        82: {
            text: "Heavy Showers",
            icon: "⛈️"
        },

        85: {
            text: "Light Snow Showers",
            icon: "🌨️"
        },

        86: {
            text: "Heavy Snow Showers",
            icon: "❄️"
        },

        95: {
            text: "Thunderstorm",
            icon: "⛈️"
        },

        96: {
            text: "Thunderstorm + Hail",
            icon: "⛈️"
        },

        99: {
            text: "Heavy Thunderstorm",
            icon: "⛈️"
        }

    };


    return (
        weatherCodes[code] ||
        {
            text: "Unknown",
            icon: "🌤️"
        }
    );
}


/* SHOW MESSAGE */

function showMessage(text) {

    message.textContent = text;
}


/* CLEAR MESSAGE */

function clearMessage() {

    message.textContent = "";
}


/* LOADING */

function setLoading(isLoading) {

    if (isLoading) {

        loading.classList.add("show");

        weatherContent.style.display =
            "none";

    } else {

        loading.classList.remove("show");

        weatherContent.style.display =
            "block";
    }
}


/* FORMAT TIME */

function formatTime(dateString) {

    const date =
        new Date(dateString);

    return date.toLocaleTimeString(
        [],
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}


/* FORMAT DATE */

function formatDate(dateString) {

    const date =
        new Date(dateString);

    return date.toLocaleDateString(
        [],
        {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );
}


/* FORMAT FORECAST DATE */

function formatForecastDay(dateString) {

    const date =
        new Date(
            dateString + "T12:00:00"
        );

    return date.toLocaleDateString(
        [],
        {
            weekday: "short"
        }
    );
}


/* SEARCH CITY */

async function searchCity(city) {

    const cleanCity =
        city.trim();


    if (cleanCity === "") {

        showMessage(
            "Please enter a city name."
        );

        return;
    }


    setLoading(true);

    clearMessage();


    try {

        const geocodingURL =
            "https://geocoding-api.open-meteo.com/v1/search" +
            `?name=${encodeURIComponent(cleanCity)}` +
            "&count=1" +
            "&language=en" +
            "&format=json";


        const response =
            await fetch(
                geocodingURL
            );


        if (!response.ok) {

            throw new Error(
                "Unable to search for the city."
            );
        }


        const data =
            await response.json();


        if (
            !data.results ||
            data.results.length === 0
        ) {

            throw new Error(
                "City not found. Please check the spelling."
            );
        }


        const location =
            data.results[0];


        currentLocation = {

            latitude:
                location.latitude,

            longitude:
                location.longitude,

            name:
                location.name,

            country:
                location.country,

            timezone:
                location.timezone
        };


        await getWeather(
            currentLocation
        );


        cityInput.value =
            location.name;


    } catch (error) {

        setLoading(false);

        showMessage(
            error.message ||
            "Something went wrong."
        );
    }
}


/* GET WEATHER */

async function getWeather(location) {

    setLoading(true);

    clearMessage();


    try {

        const weatherURL =
            "https://api.open-meteo.com/v1/forecast" +

            `?latitude=${location.latitude}` +

            `&longitude=${location.longitude}` +

            "&current=" +
            "temperature_2m," +
            "relative_humidity_2m," +
            "apparent_temperature," +
            "precipitation," +
            "weather_code," +
            "wind_speed_10m" +

            "&hourly=" +
            "precipitation_probability" +

            "&daily=" +
            "weather_code," +
            "temperature_2m_max," +
            "temperature_2m_min," +
            "precipitation_probability_max," +
            "sunrise," +
            "sunset," +
            "uv_index_max" +

            "&timezone=auto" +

            "&forecast_days=7";


        const response =
            await fetch(
                weatherURL
            );


        if (!response.ok) {

            throw new Error(
                "Weather service is unavailable."
            );
        }


        const data =
            await response.json();


        displayWeather(
            location,
            data
        );


    } catch (error) {

        showMessage(
            error.message ||
            "Unable to load weather."
        );

    } finally {

        setLoading(false);
    }
}


/* DISPLAY WEATHER */

function displayWeather(
    location,
    data
) {

    const current =
        data.current;

    const daily =
        data.daily;


    const weatherInfo =
        getWeatherInfo(
            current.weather_code
        );


    /* LOCATION */

    cityName.textContent =
        location.name;

    countryName.textContent =
        location.country;


    /* CURRENT */

    temperature.textContent =
        Math.round(
            current.temperature_2m
        );

    weatherIcon.textContent =
        weatherInfo.icon;

    weatherCondition.textContent =
        weatherInfo.text;

    feelsLike.textContent =
        Math.round(
            current.apparent_temperature
        );

    humidity.textContent =
        `${current.relative_humidity_2m}%`;

    windSpeed.textContent =
        `${Math.round(
            current.wind_speed_10m
        )} km/h`;


    /* RAIN */

    const currentHour =
        new Date(
            current.time
        ).getHours();


    let rainProbability = 0;


    if (
        data.hourly &&
        data.hourly.time
    ) {

        const currentHourIndex =
            data.hourly.time.findIndex(
                function(time) {

                    return time ===
                        current.time;
                }
            );


        if (
            currentHourIndex !== -1
        ) {

            rainProbability =
                data.hourly
                    .precipitation_probability[
                        currentHourIndex
                    ] || 0;
        }
    }


    rainChance.textContent =
        `${rainProbability}%`;


    /* UV */

    uvIndex.textContent =
        Number(
            daily.uv_index_max[0]
        ).toFixed(1);


    /* SUNRISE */

    sunrise.textContent =
        formatTime(
            daily.sunrise[0]
        );


    /* SUNSET */

    sunset.textContent =
        formatTime(
            daily.sunset[0]
        );


    /* DATE */

    currentDate.textContent =
        formatDate(
            current.time
        );


    /* LOCAL CLOCK */

    updateLocalTime(
        location.timezone
    );


    /* FORECAST */

    displayForecast(
        daily
    );
}


/* LOCAL TIME */

function updateLocalTime(
    timezone
) {

    try {

        const now =
            new Date();


        const time =
            now.toLocaleTimeString(
                [],
                {
                    timeZone: timezone,

                    hour: "2-digit",

                    minute: "2-digit",

                    second: "2-digit"
                }
            );


        localTime.textContent =
            time;

    } catch {

        localTime.textContent =
            "--";
    }
}


/* UPDATE CLOCK EVERY SECOND */

setInterval(
    function() {

        if (
            currentLocation &&
            currentLocation.timezone
        ) {

            updateLocalTime(
                currentLocation.timezone
            );
        }

    },
    1000
);


/* FORECAST */

function displayForecast(
    daily
) {

    forecast.innerHTML = "";


    for (
        let i = 0;
        i < daily.time.length;
        i++
    ) {

        const weatherInfo =
            getWeatherInfo(
                daily.weather_code[i]
            );


        const card =
            document.createElement(
                "div"
            );


        card.className =
            "forecast-card";


        card.innerHTML = `

            <div class="forecast-day">
                ${
                    i === 0
                        ? "Today"
                        : formatForecastDay(
                            daily.time[i]
                        )
                }
            </div>

            <div class="forecast-icon">
                ${weatherInfo.icon}
            </div>

            <div class="forecast-temp">
                ${Math.round(
                    daily.temperature_2m_max[i]
                )}°C
            </div>

            <div class="forecast-low">
                ${Math.round(
                    daily.temperature_2m_min[i]
                )}°C
            </div>

            <div class="forecast-rain">
                🌧️ ${
                    daily
                        .precipitation_probability_max[i]
                }%
            </div>

        `;


        forecast.appendChild(
            card
        );
    }
}


/* SEARCH BUTTON */

searchBtn.addEventListener(
    "click",
    function() {

        searchCity(
            cityInput.value
        );
    }
);


/* ENTER KEY */

cityInput.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Enter"
        ) {

            searchCity(
                cityInput.value
            );
        }
    }
);


/* CURRENT LOCATION */

locationBtn.addEventListener(
    "click",
    function() {

        if (
            !navigator.geolocation
        ) {

            showMessage(
                "Geolocation is not supported by your browser."
            );

            return;
        }


        setLoading(true);

        clearMessage();


        navigator.geolocation.getCurrentPosition(

            async function(position) {

                const location = {

                    latitude:
                        position.coords.latitude,

                    longitude:
                        position.coords.longitude,

                    name:
                        "My Location",

                    country:
                        "Current Location",

                    timezone:
                        "auto"
                };


                try {

                    const reverseURL =
                        "https://geocoding-api.open-meteo.com/v1/search" +
                        `?name=${encodeURIComponent(
                            "Anantapur"
                        )}` +
                        "&count=1" +
                        "&language=en" +
                        "&format=json";


                    /*
                     * We don't need reverse geocoding
                     * for the weather itself.
                     */

                    await getWeather(
                        location
                    );

                    cityInput.value =
                        "My Location";

                } catch {

                    setLoading(false);
                }

            },

            function(error) {

                setLoading(false);


                if (
                    error.code ===
                    error.PERMISSION_DENIED
                ) {

                    showMessage(
                        "Location permission was denied."
                    );

                } else {

                    showMessage(
                        "Unable to detect your location."
                    );
                }
            }
        );
    }
);


/* REFRESH */

refreshBtn.addEventListener(
    "click",
    function() {

        if (
            currentLocation
        ) {

            getWeather(
                currentLocation
            );

        } else {

            searchCity(
                "Anantapur"
            );
        }
    }
);


/* INITIAL WEATHER */

searchCity("Anantapur");