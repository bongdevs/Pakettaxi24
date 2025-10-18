/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { Order } from '../../data/types';
import L from 'leaflet';

// Simple hash function to generate deterministic coordinates from a string
const hashCode = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

// Generate mock coordinates based on an address string
const getCoords = (address: string): [number, number] => {
    const latBase = 34.0522; // Los Angeles
    const lngBase = -118.2437;
    const hash = hashCode(address);
    const latOffset = (hash % 10000) / 100000; // smaller offset
    const lngOffset = (hashCode(address.split('').reverse().join('')) % 10000) / 100000; // different hash for lng
    return [latBase + latOffset, lngBase + lngOffset];
};


const UpdateBounds = ({ bounds }: { bounds: L.LatLngBoundsExpression }) => {
    const map = useMap();
    useEffect(() => {
        if (bounds) {
             map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [map, bounds]);
    return null;
}

interface OrderRouteMapProps {
    order: Order;
}

export const OrderRouteMap = ({ order }: OrderRouteMapProps) => {
    const pickupCoords = getCoords(order.pickupAddress);
    const dropoffCoords = order.dropoffPoints.map(p => getCoords(p.address));
    const allCoords: L.LatLngExpression[] = [pickupCoords, ...dropoffCoords];
    
    const bounds = L.latLngBounds(allCoords);

    return (
        <div className="map-container-details" style={{ marginTop: 0 }}>
            <MapContainer center={pickupCoords} zoom={13} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={pickupCoords}>
                    <Popup>Pickup: {order.pickupAddress}</Popup>
                </Marker>
                {dropoffCoords.map((coords, index) => (
                    <Marker position={coords} key={order.dropoffPoints[index].id}>
                        <Popup>Dropoff #{index + 1}: {order.dropoffPoints[index].address}</Popup>
                    </Marker>
                ))}
                <Polyline positions={allCoords} color="var(--primary-color)" />
                <UpdateBounds bounds={bounds} />
            </MapContainer>
        </div>
    );
};