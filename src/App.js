import './App.css';
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Corrigir o ícone padrão do marker
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});



function App() {
  const [name, setName] = useState('brazil');
  const [countrie, setCountrie] = useState();

  const getDatabyName = async () => {
    try {
      const response = await fetch(`https://restcountries.com/v3.1/name/${name}`);
      const data_array = await response.json();
      const data_object = await data_array[0];
      setCountrie(data_object);
      console.log(data_object);
    } catch (error) {
      console.error('Erro ao buscar país:', error);
      setCountrie(null)
    }
  };

  useEffect(() => {
    // Este código roda quando o componente é carregado (montado)
    getDatabyName();
    // Aqui você pode chamar funções, carregar dados, etc.
  },[]); // O array vazio garante que execute só uma vez (como o onload)
  const handlerOnChangeName = (e) => {
    setName(e.target.value);
  };

  function ChangeMapView({ coords }) {
    const map = useMap();

    useEffect(() => {
      map.setView(coords, 4);
    }, [coords, map]);

    return null;
  }

  return (
    <div className="App">
      <div className="map-container">
        <h2>Search data of country:</h2>
        <input type="text" value={name} onChange={handlerOnChangeName} />
        <button className="btn-primary" onClick={getDatabyName}>
          Search
        </button>

        {countrie && (
          <MapContainer
            center={countrie.latlng}
            zoom={4}
            style={{ height: '400px', width: '100%' }}
          >
            <ChangeMapView coords={countrie.latlng} />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={countrie.latlng}>
              <Popup>
                {countrie.name.common}
                <br />
                Capital: {countrie.capital?.[0]}
              </Popup>
            </Marker>
          </MapContainer>
        )}
      </div>

      {countrie && (
        <div className="details-container">
          <h2>Details of Country</h2>

          <h3>Flag</h3>
          <img alt="flag of country" src={countrie.flags.png} width="90px" />

          <h3>Official Name</h3>
          <p>{countrie.name.official}</p>

          {countrie.translations?.por?.common && (
            <>
              <h3>Name in Portuguese</h3>
              <p>{countrie.translations.por.common}</p>
            </>
          )}

          {countrie.capital?.[0] && (
            <>
              <h3>Capital</h3>
              <p>{countrie.capital}</p>
            </>
          )}

          {countrie.population && (
            <>
              <h3>Population</h3>
              <p>{countrie.population.toLocaleString()}</p>
            </>
          )}

          {countrie.area && (
            <>
              <h3>Area</h3>
              <p>{countrie.area.toLocaleString()} km²</p>
            </>
          )}

          {countrie.currencies && (
            <>
              <h3>Currency</h3>
              <ul>
                {Object.entries(countrie.currencies).map(([code, currency]) => (
                  <p>
                    {currency.name} {currency.symbol}
                  </p>

                ))}
              </ul>
            </>
          )}

          {countrie.languages && (
            <>
              <h3>Languages</h3>
              
                {Object.values(countrie.languages).map((lang, i) => (
                  <p>
                    {lang}
                  </p>
                ))}
            </>
          )}

          {countrie.region && (
            <>
              <h3>Region</h3>
              <p>{countrie.region}</p>
            </>
          )}

          {countrie.subregion && (
            <>
              <h3>Subregion</h3>
              <p>{countrie.subregion}</p>
            </>
          )}

          {countrie.timezones && (
            <>
              <h3>Timezones</h3>
                {countrie.timezones.map((tz, i) => (
                  <p>{tz}</p>
                ))}
            </>
          )}

          {countrie.idd?.root && (
            <>
              <h3>Calling Code</h3>
              <p>
                {countrie.idd.root}
                {countrie.idd.suffixes?.[0]}
              </p>
            </>
          )}

          {countrie.borders && (
            <>
              <h3>Borders</h3>
              <p>{countrie.borders.join(', ')}</p>
            </>
          )}


        </div>
      )}
    </div>
  );
}

export default App;
