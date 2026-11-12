const apiKey = "4c3fb3dc336e3f3a2ccfc656bf857318";
const apiUrl ="https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcn = document.querySelector(".weather-icon");

const toggleBtn = document.querySelector(".chat-toggle");
const chatContainer = document.querySelector(".chatbot-container");
const sendBtn = document.querySelector("#send-btn");
const chatInput = document.querySelector("#chat-input");
const chatMessages = document.querySelector("#chat-messages");

let lastWeatherData = null;

// WEATHER FUNCTION
async function checkWeather(city) {
  const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

  if (response.status == 404) {
    document.querySelector(".error").style.display = "block";
    document.querySelector(".error").innerHTML =
      `${city} is an invalid city name`;
    document.querySelector(".weather").style.display = "none";
    return;
  }

  var data = await response.json();
  lastWeatherData = data;

  document.querySelector(".city").innerHTML = data.name;
  document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
  document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
  document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

  if (data.weather[0].main == "Clouds") weatherIcn.src = "Images/clouds.png";
  else if (data.weather[0].main == "Drizzle")
    weatherIcn.src = "Images/drizzle.png";
  else if (data.weather[0].main == "Mist") weatherIcn.src = "Images/mist.png";
  else if (data.weather[0].main == "Rain") weatherIcn.src = "Images/rain.png";
  else if (data.weather[0].main == "Snow") weatherIcn.src = "Images/snow.png";
  else if (data.weather[0].main == "Clear") weatherIcn.src = "Images/clear.png";

  document.querySelector(".weather").style.display = "block";
  document.querySelector(".error").style.display = "none";
}

searchBtn.addEventListener("click", () => {
  checkWeather(searchBox.value);
});

// CHAT TOGGLE
toggleBtn.addEventListener("click", () => {
  chatContainer.style.display =
    chatContainer.style.display === "flex" ? "none" : "flex";
});

// ADD MESSAGE
function addMessage(sender, text) {
  const msg = document.createElement("div");
  msg.classList.add(sender);
  msg.textContent = text;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// AI SMART REPLY
function botReply(userMsg) {
  userMsg = userMsg.toLowerCase();

  if (!lastWeatherData) {
    return "⚠️ Please search a city first!";
  }

  const temp = lastWeatherData.main.temp;
  const condition = lastWeatherData.weather[0].main;

  // WEATHER SUMMARY
  if (userMsg.includes("summary")) {
    return `🌤️ It's ${temp}°C with ${condition}. Humidity is ${lastWeatherData.main.humidity}%.`;
  }

  // WHAT TO WEAR
  if (userMsg.includes("wear")) {
    if (temp < 15) return "🧥 Wear warm clothes!";
    if (temp < 25) return "👕 Light clothes are fine.";
    return "🩳 Stay cool with light summer wear!";
  }

  // ACTIVITY SUGGESTION
  if (userMsg.includes("activity") || userMsg.includes("do")) {
    if (condition === "Rain") return "☔ Stay indoors, maybe watch movies!";
    if (condition === "Clear") return "🌞 Great day for outdoor activities!";
    return "🚶‍♂️ A walk sounds nice!";
  }

  if (userMsg.includes("weather")) {
    return `Current weather is ${condition} with ${temp}°C.`;
  }

  return "🤖 Ask me about weather, clothing, or activities!";
}

// SEND MESSAGE
sendBtn.addEventListener("click", () => {
  const userText = chatInput.value.trim();
  if (userText === "") return;

  addMessage("user", userText);
  const reply = botReply(userText);
  setTimeout(() => addMessage("bot", reply), 500);

  chatInput.value = "";
});