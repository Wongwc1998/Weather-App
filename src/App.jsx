import { useState, useEffect } from 'react'
import axios from 'axios'
import countryData from './db.json';

const api_key = import.meta.env.VITE_API_KEY;

const CountriesDisplay = ({ filter, countries, }) => {
  const [weather, setWeather] = useState(null);
  console.log(api_key);
  const filteredCountries = countries.filter((country) => country.name.common.toLowerCase().includes(filter));
  useEffect(() => {
    if (filteredCountries.length === 1) {
      const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${filteredCountries[0].capital}&appid=${api_key}&units=metric`;

      axios.get(apiURL)
        .then((response) => {
          setWeather(response.data);
        })
        .catch(error => {
          console.error("Error fetching weather data: ", error);
          setWeather(null);
        });
    } else {
      setWeather(null);
    }
  }, [filter]);
  if (filteredCountries.length === 1) {
    const country = filteredCountries[0];
    return (<div>
      <h1>{country.name.common}</h1>
      <div>capital {country.capital[0]}</div>
      <div>area {country.area} km<sup>2</sup></div>
      <h2>languages</h2>
      <ul>
        {Object.values(country.languages).map((language) => <li key={language}>{language}</li>)}
      </ul>
      <img src={country.flags.png} alt="flag" width="100" height="100" />
      {weather && (
        <div>
          <h2>Weather in {country.capital[0]}</h2>
          <p>Temperature {weather.main.temp} Celsius</p>
          <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`} />
          <p>Wind {weather.wind.speed} m/s</p>
        </div>)
      }
    </div >);
  }
  else if (filteredCountries.length < 10) {
    return filteredCountries.map((country) => {
      return (<div key={country.name.common}>
        {country.name.common}
      </div>);
    }
    );
  }
  else {
    return <div>Too many matches, specify another filter</div>
  }

}

const App = () => {
  console.log(api_key);
  const [input, setInput] = useState('')
  const countries = countryData.countries

  return (
    <div>
      find countries <input value={input} onChange={(e) => setInput(e.target.value)} />
      <CountriesDisplay filter={input} countries={countries} />
    </div>
  )

}

export default App