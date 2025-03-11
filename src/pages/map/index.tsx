import { useEffect, useState } from 'react';
import liff from '@line/liff';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';

const MapPage = () => {
  const [location, setLocation] = useState<LatLngExpression | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if(typeof window === 'undefined') {
      return;
    }
    const initializeLiff = async () => {
      try {
        await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! });
        if (!liff.isLoggedIn()) {
          liff.login();
        }
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation([position.coords.latitude, position.coords.longitude]);
          },
          (error) => {
            console.error(error);
            setError('Failed to get current position');
          }
        );
      } catch (error) {
        console.error(error);
        setError('LIFF initialization failed');
      }
    };
    initializeLiff();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {location ? (
        <MapContainer center={location} zoom={15} style={{ height: '500px', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={location}>
            <Popup>
              You are here.
            </Popup>
          </Marker>
        </MapContainer>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default MapPage;