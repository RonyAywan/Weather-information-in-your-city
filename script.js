const form = document.getElementById("weatherForm");
const cityInput = document.getElementById("cityInput");
const weatherResult = document.getElementById("weatherResult");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const city = cityInput.value.trim();
  if (!city) return;

  weatherResult.classList.remove("hidden");
  weatherResult.innerHTML = "Loading...";

  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;

    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      weatherResult.innerHTML = "City not found.";
      return;
    }

    const location = geoData.results[0];
    const { latitude, longitude, name, country } = location;

    const weatherUrl =
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
      `&current=temperature_2m,relative_humidity_2m,wind_speed_10m`;

    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    const current = weatherData.current;

    weatherResult.innerHTML = `
      <h2>${name}, ${country}</h2>
      <div class="temp">${current.temperature_2m}°C</div>
      <p>Humidity: ${current.relative_humidity_2m}%</p>
      <p>Wind Speed: ${current.wind_speed_10m} km/h</p>
    `;
  } catch (error) {
    weatherResult.innerHTML = "Something went wrong. Try again.";
    console.error(error);
  }
});