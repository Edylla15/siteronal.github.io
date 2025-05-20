import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValidated, setSearchValidated] = useState(false);

  function getNextDays() {
    const days = [];
    const now = new Date();
    for (let i = 1; i <= 4; i++) {
      const next = new Date(now);
      next.setDate(now.getDate() + i);
      const dayName = next.toLocaleDateString("fr-FR", { weekday: "long" });
      days.push(dayName.charAt(0).toUpperCase() + dayName.slice(1));
    }
    return days;
  }

  const nextDays = getNextDays();

  const handleSearch = async () => {
    if (!city) return;
    setLoading(true);

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=734a861e8b8883e191ffa167ee1142dd&units=metric&lang=fr`
      );
      setWeatherData(response.data);
      setSearchValidated(true);
    } catch (error) {
      console.error("Erreur lors de la récupération des données météo :", error);
      alert("Ville introuvable ou erreur réseau.");
      setSearchValidated(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchForecastData = async (cityName) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=734a861e8b8883e191ffa167ee1142dd&units=metric&lang=fr`
      );
      const data = await res.json();
      const dailyForecast = data.list.filter(item => item.dt_txt.includes("12:00:00"));
      const slicedForecast = dailyForecast.slice(1, 5).map(item => ({
        date: item.dt_txt,
        min: Math.round(item.main.temp_min),
        max: Math.round(item.main.temp_max),
        icon: item.weather[0].icon,
        description: item.weather[0].description
      }));
      return slicedForecast;
    } catch (error) {
      console.error("Erreur lors du chargement des prévisions :", error);
      return [];
    }
  };

  return (
    <div className="w-[1440px] h-[1024px] bg-[rgba(30,63,255,0.3)]">
      <div
        className="w-[471px] h-[1024px] bg-cover bg-no-repeat bg-center rounded-[20px] absolute left-0 top-0"
        style={{ backgroundImage: "url('/sky.jpg')" }}
      >
        {weatherData ? (
          <>
            <div className="absolute top-[52px] right-[38px] text-white">
              <div className="text-[24px] font-extrabold">
                {new Date().toLocaleDateString("fr-FR", { weekday: "long" })
                  .charAt(0).toUpperCase() +
                  new Date().toLocaleDateString("fr-FR", { weekday: "long" }).slice(1)}
              </div>
              <div className="text-[24px] font-extrabold">
                {new Date().toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <div className="flex items-center gap-2 mt-2 justify-end">
                <img
                  src="/localisation.png"
                  alt="Localisation"
                  className="w-[32px] h-[32px] filter invert brightness-200"
                />
                <span className="text-[24px] font-extrabold">
                  {weatherData.name}, {weatherData.sys.country}
                </span>
              </div>
            </div>

            <div className="absolute top-[350px] left-1/2 transform -translate-x-1/2 text-center text-white">
              <div className="text-[96px] font-extrabold">
                {Math.round(weatherData.main.temp)}°C
              </div>
              <img
                src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`}
                alt="Météo"
                className="w-[325px] h-[300px] mx-auto"
              />
              <div className="text-[40px] font-normal mt-0 capitalize">
                {weatherData.weather[0].description}
              </div>
            </div>
          </>
        ) : (
          <div className="absolute top-[300px] left-1 transform -translate-x-1 text-center text-white text-[40px]">
            Entrez une ville pour afficher la météo
          </div>
        )}
      </div>

      <div className="absolute top-[32px] left-[574px] flex flex-col space-y-[100px]">
        <div className="flex flex-col space-y-4">
          <div className="flex space-x-6">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Entrez une ville"
              className="bg-[#5068F0] text-white placeholder-white text-[48px] font-léger w-[568px] h-[80px] px-6 rounded-[20px] outline-none"
            />
            <button
              onClick={async () => {
                await handleSearch();
                const data = await fetchForecastData(city);
                setForecastData(data);
              }}
              className="bg-[#262DE2] text-white text-[26px] font-extrabold w-[264px] h-[80px] flex items-center justify-center rounded-[20px]"
            >
              🔍 Rechercher
            </button>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => {
                setCity("");
                setWeatherData(null);
                setForecastData([]);
                setSearchValidated(false);
              }}
              className="bg-[#262DE2] text-white text-[26px] font-extrabold w-[264px] h-[70px] rounded-[20px]"
            >
               Retour à l'accueil
            </button>
          </div>
        </div>

        {weatherData && (
          <div className="w-[832px] h-[132px] bg-[#65A7EA] rounded-[30px] flex items-center justify-between px-10">
            <div className="flex flex-col justify-between h-full py-6">
              <p className="text-white text-[36px] font-extrabold">Humidité</p>
              <p className="text-white text-[36px] font-extrabold">Vitesse du vent</p>
            </div>
            <div className="flex flex-col justify-between h-full py-6 text-right">
              <p className="text-white text-[36px] font-medium">{weatherData.main.humidity}%</p>
              <p className="text-white text-[36px] font-medium">{weatherData.wind.speed} km/h</p>
            </div>
          </div>
        )}

        {searchValidated && forecastData && forecastData.length > 0 && (
          <div className="flex flex-row space-x-[26px]">
            {forecastData.map((item, index) => {
              const jour = nextDays[index] || "Jour";
              return (
                <div
                  key={index}
                  className="w-[195px] h-[350px] bg-[#65A7EA] rounded-[30px] flex flex-col items-center py-6 px-4"
                >
                  <p className="text-white text-[36px] font-extrabold mb-4">
                    {jour.charAt(0).toUpperCase() + jour.slice(1)}
                  </p>
                  <p className="text-[#0A065E] text-[20px] font-medium mb-4">
                    {item.min}°C / {item.max}°C
                  </p>
                  <img
                    src={`https://openweathermap.org/img/wn/${item.icon}@2x.png`}
                    alt={item.description}
                    className="w-[200px] h-[200px]"
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
