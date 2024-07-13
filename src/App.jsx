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

  const [radius, setRadius] = useState(10);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const getRandomLocation = (latitude, longitude, distance) => {
    const radiusInDegrees = distance / 111;
    const u = Math.random();
    const v = Math.random();
    const w = radiusInDegrees * Math.sqrt(u);
    const t = 2 * Math.PI * v;
    const newLatitude = latitude + w * Math.cos(t);
    const newLongitude =
      longitude + (w * Math.sin(t)) / Math.cos(latitude * (Math.PI / 180));
    return { latitude: newLatitude, longitude: newLongitude };
  };

  const userGroups = useMemo(() => {
    if (!coords) return {};

    return {
      10: [
        {
          id: 1,
          ...getRandomLocation(coords.latitude, coords.longitude, 10),
          name: "Carl",
          surname: "Johnson",
        },
        {
          id: 2,
          ...getRandomLocation(coords.latitude, coords.longitude, 10),
          name: "Big",
          surname: "Smoke",
        },
      ],
      20: [
        {
          id: 3,
          ...getRandomLocation(coords.latitude, coords.longitude, 20),
          name: "Sweet",
          surname: "Johnson",
        },
      ],
      30: [
        {
          id: 4,
          ...getRandomLocation(coords.latitude, coords.longitude, 30),
          name: "Cesar",
          surname: "Vialpando",
        },
      ],
      40: [
        {
          id: 5,
          ...getRandomLocation(coords.latitude, coords.longitude, 40),
          name: "Lance",
          surname: "Wilson",
        },
      ],
      300: [
        {
          id: 6,
          ...getRandomLocation(coords.latitude, coords.longitude, 300),
          name: "Ken",
          surname: "Rosenberg",
        },
        {
          id: 7,
          ...getRandomLocation(coords.latitude, coords.longitude, 300),
          name: "Mike",
          surname: "Toreno",
        },
        {
          id: 8,
          ...getRandomLocation(coords.latitude, coords.longitude, 300),
          name: "Madd",
          surname: "Dogg",
        },
        {
          id: 9,
          ...getRandomLocation(coords.latitude, coords.longitude, 300),
          name: "Salvatore",
          surname: "Leone",
        },
        {
          id: 10,
          ...getRandomLocation(coords.latitude, coords.longitude, 300),
          name: "Jimmy",
          surname: "Hernandez",
        },
        {
          id: 11,
          ...getRandomLocation(coords.latitude, coords.longitude, 300),
          name: "Eddie",
          surname: "Pulaski",
        },
        {
          id: 12,
          ...getRandomLocation(coords.latitude, coords.longitude, 300),
          name: "Kendl",
          surname: "Johnson",
        },
        {
          id: 13,
          ...getRandomLocation(coords.latitude, coords.longitude, 300),
          name: "Frank",
          surname: "Tenpenny",
        },
      ],
    };
  }, [coords]);

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

      const allUsers = [
        ...(userGroups[10] || []),
        ...(radius >= 20 ? userGroups[20] || [] : []),
        ...(radius >= 30 ? userGroups[30] || [] : []),
        ...(radius >= 40 ? userGroups[40] || [] : []),
        ...(radius >= 300 ? userGroups[300] || [] : []),
      ];

      const usersWithinRadius = allUsers.filter((user) => {
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
  }, [coords, radius, userGroups]);

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
              <option value={300}>300 km</option>
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
          <Loader />
        </div>
      )}
    </>
  );
};

export default App;
