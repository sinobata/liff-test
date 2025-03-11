import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

export default function Map() {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [customIcon, setCustomIcon] = useState<L.Icon | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('leaflet').then(L => {
        // カスタムアイコンの作成
        const icon = L.icon({
          iconUrl: '/marker.svg', // カスタムアイコンのパス
          iconSize: [40, 41], // アイコンのサイズ
          iconAnchor: [12, 41], // アイコンのアンカー位置
          popupAnchor: [1, -34], // ポップアップのアンカー位置
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png', // 影の画像
          shadowSize: [41, 41], // 影のサイズ
        });

        setCustomIcon(icon);

        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setPosition([position.coords.latitude, position.coords.longitude]);
            },
            (error) => {
              console.error('Error obtaining geolocation', error);
            }
          );
        } else {
          console.error('Geolocation is not available');
        }
      });
    }
  }, []);

  return (
    <div style={{ height: '100vh' }}>
      {position && customIcon ? (
        <MapContainer center={position} zoom={16} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={position} icon={customIcon}>
            <Popup>Your location</Popup>
          </Marker>
        </MapContainer>
      ) : (
        <p>Loading map...</p>
      )}
    </div>
  );
}