import { useEffect, useState } from 'react';
import liff from '@line/liff';
import { LatLngExpression } from 'leaflet';
import dynamic from 'next/dynamic';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });


export default function  Map() {
  const [location, setLocation] = useState<LatLngExpression | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if(typeof window === 'undefined') {
      return;
    }
    const initializeLiff = async () => {
      try {
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
        <MapContainer center={location} zoom={15} style={{ height: '100%', width: '100%' }}>
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
