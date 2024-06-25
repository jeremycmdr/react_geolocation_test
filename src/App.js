import React, { useState, useEffect, useMemo } from "react";
import { useGeolocated } from "react-geolocated";
import MapComponent from "./MapComponent";
import Loader from "./Loader";

const App = () => {
  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      userDecisionTimeout: 10000,
    });

  // Hardcoded users
  const nearbyUsers = useMemo(
    () => [
      {
        id: 1,
        latitude: 44.395,
        longitude: 19.114,
        name: "Carl",
        surname: "Johnson",
      },
      {
        id: 2,
        latitude: 44.381,
        longitude: 19.1,
        name: "Big",
        surname: "Smoke",
      },
      {
        id: 3,
        latitude: 44.52,
        longitude: 19.15,
        name: "Sweet",
        surname: "Johnson",
      },
      {
        id: 4,
        latitude: 44.62,
        longitude: 19.2,
        name: "Cesar",
        surname: "Vialpando",
      },
      {
        id: 5,
        latitude: 44.72,
        longitude: 19.2,
        name: "Denise",
        surname: "Robinson",
      },
      {
        id: 6,
        latitude: 44.22,
        longitude: 19.2,
        name: "Lance",
        surname: "Wilson",
      },
    ],
    []
  );

  const [radius, setRadius] = useState(10);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const handleRadiusChange = (event) => {
    setRadius(Number(event.target.value));
  };

  useEffect(() => {
    if (coords) {
      const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const toRad = (value) => (value * Math.PI) / 180;
        const R = 6371;
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRad(lat1)) *
            Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
      };

      const usersWithinRadius = nearbyUsers.filter((user) => {
        const distance = calculateDistance(
          coords.latitude,
          coords.longitude,
          user.latitude,
          user.longitude
        );
        return distance <= radius;
      });

      setFilteredUsers(usersWithinRadius);
    }
  }, [coords, radius, nearbyUsers]);

  return (
    <>
      {!isGeolocationAvailable ? (
        <div>Your browser does not support Geolocation</div>
      ) : !isGeolocationEnabled ? (
        <div style={{ textAlign: "center", color: "red" }}>
          Geolocation is not enabled
        </div>
      ) : coords ? (
        <>
          <MapComponent
            userLocation={{ lat: coords.latitude, lng: coords.longitude }}
            nearbyUsers={filteredUsers}
            radius={radius}
          />
          <div>
            <div
              style={{
                display: "inline-block",
                padding: "25px",
              }}
            >
              Select radius:
            </div>
            <select value={radius} onChange={handleRadiusChange}>
              <option value={10}>10 km</option>
              <option value={20}>20 km</option>
              <option value={30}>30 km</option>
              <option value={40}>40 km</option>
            </select>
          </div>
          <div style={{ padding: "25px" }}>
            <h3>Users within {radius} km:</h3>
            <ul>
              {filteredUsers.map((user) => (
                <li key={user.id}>
                  {user.name} {user.surname}
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div>Getting the location data...</div>
          <Loader></Loader>
        </div>
      )}
    </>
  );
};

export default App;
