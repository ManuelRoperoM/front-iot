import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'
export const MapMetering = ({ latitude, longitude }) => {
  const DefaultIcon = L.icon({
    iconUrl: icon, // Imagen del ícono
    shadowUrl: iconShadow, // Imagen de la sombra
    iconSize: [25, 41], // Tamaño del ícono (ancho, alto)
    iconAnchor: [12, 41], // Punto del ícono que se ancla al mapa
    popupAnchor: [1, -34], // Punto donde se ancla el popup al ícono
    shadowSize: [41, 41] // Tamaño de la sombra
  })
  L.Marker.prototype.options.icon = DefaultIcon
  return (
    <MapContainer center={[latitude, longitude]} zoom={13} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[latitude, longitude]}>
        <Popup>
          Marcador en: {latitude}, {longitude}
        </Popup>
      </Marker>
    </MapContainer>
  )
}
