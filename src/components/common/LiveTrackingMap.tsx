/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import * as React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Driver } from '../../data/types';

function UpdateMapView({ center }: { center: [number, number] }) {
    const map = useMap();
    map.setView(center, map.getZoom());
    return null;
}

interface LiveTrackingMapProps {
    driverName: string;
    drivers: Driver[];
}

export const LiveTrackingMap = ({ driverName, drivers }: LiveTrackingMapProps) => {
    const driver = drivers.find(d => d.name === driverName);
    const [position, setPosition] = React.useState<[number, number] | null>(driver ? [driver.lat, driver.lng] : null);

    React.useEffect(() => {
        if (!driver) return;
        const interval = setInterval(() => {
            setPosition(prevPos => {
                if (!prevPos) return null;
                return [
                    prevPos[0] + (Math.random() - 0.5) * 0.001,
                    prevPos[1] + (Math.random() - 0.5) * 0.001,
                ];
            });
        }, 3000); // Update every 3 seconds
        return () => clearInterval(interval);
    }, [driver]);

    if (!driver || !position) {
        return <p>Driver location not available.</p>;
    }

    return (
        <div className="map-container-details">
            <MapContainer center={position} zoom={15} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                    <Popup>{driver.name} is here.</Popup>
                </Marker>
                <UpdateMapView center={position} />
            </MapContainer>
        </div>
    );
};
