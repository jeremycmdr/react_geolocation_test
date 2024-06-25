import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const userIcon = L.icon({
  iconUrl: "https://leafletjs.com/examples/custom-icons/leaf-red.png",
  shadowUrl: "https://leafletjs.com/examples/custom-icons/leaf-shadow.png",
  iconSize: [38, 95],
  shadowSize: [50, 64],
  iconAnchor: [22, 94],
  shadowAnchor: [4, 62],
  popupAnchor: [-3, -76],
});

const MapComponent = ({ userLocation, nearbyUsers }) => {
  return (
    <MapContainer
      center={[userLocation.lat, userLocation.lng]}
      zoom={12}
      style={{ height: "600px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
        <Popup>Your Location</Popup>
      </Marker>
      {nearbyUsers.map((user) => (
        <Marker key={user.id} position={[user.latitude, user.longitude]}>
          <Popup>
            {user.name} {user.surname}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
