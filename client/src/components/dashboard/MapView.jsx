import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Component to handle map center updates
const MapUpdater = ({ center, zoom, focusBounds }) => {
    const map = useMap();

    useEffect(() => {
        if (focusBounds && focusBounds.length > 0) {
            // Focus on district bounds
            const latLngs = focusBounds.map(w => [w.coordinates.lat, w.coordinates.lng]);
            if (latLngs.length > 0) {
                map.fitBounds(latLngs, { padding: [50, 50], maxZoom: 10 });
            }
        } else if (center) {
            map.setView([center.lat, center.lng], zoom || 8);
        }
    }, [center, zoom, map, focusBounds]);

    return null;
};

const MapView = ({
    wells = [],
    center = { lat: 31.1471, lng: 75.3412 },
    zoom = 8,
    onWellClick,
    selectedWellId,
    focusDistrict = ''
}) => {

    // Color based on depth status
    const getMarkerColor = (color) => {
        const colors = {
            blue: '#22c55e', // Green for Safe
            yellow: '#facc15', // Bright Yellow for Moderate
            amber: '#f97316', // Orange for High
            red: '#ef4444', // Red for Critical
            gray: '#9CA3AF',
        };
        return colors[color] || colors.gray;
    };

    // Get marker size based on status
    const getMarkerRadius = (status, isSelected) => {
        if (isSelected) return 12;
        if (status === 'critical') return 10;
        return 8;
    };

    return (
        <div className="h-full w-full rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 transition-colors duration-200">
            <MapContainer
                center={[center.lat, center.lng]}
                zoom={zoom}
                className="h-full w-full"
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapUpdater center={center} zoom={zoom} focusBounds={focusDistrict ? wells : null} />

                {/* Well Markers */}
                {wells.map((well) => (
                    <CircleMarker
                        key={well.wellId}
                        center={[well.coordinates.lat, well.coordinates.lng]}
                        radius={getMarkerRadius(well.status, well.wellId === selectedWellId)}
                        pathOptions={{
                            color: 'white',
                            weight: 2,
                            fillColor: getMarkerColor(well.color),
                            fillOpacity: 0.9
                        }}
                        eventHandlers={{
                            click: () => onWellClick && onWellClick(well),
                        }}
                    >
                        <Popup>
                            <div className="p-2 min-w-[200px]">
                                <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">{well.wellId}</h3>
                                <div className="space-y-1 text-sm">
                                    <p className="text-slate-600 dark:text-slate-300">
                                        <span className="font-medium">District:</span> {well.district}
                                    </p>
                                    {well.block && (
                                        <p className="text-slate-600 dark:text-slate-300">
                                            <span className="font-medium">Block:</span> {well.block}
                                        </p>
                                    )}
                                    <p className="text-slate-600 dark:text-slate-300">
                                        <span className="font-medium">Depth:</span>{' '}
                                        <span className={`font-semibold ${well.status === 'critical' ? 'text-red-600 dark:text-red-400' :
                                            well.status === 'warning' ? 'text-amber-600 dark:text-amber-400' : 'text-blue-600 dark:text-blue-400'
                                            }`}>
                                            {well.depth !== null ? `${well.depth.toFixed(1)}m` : 'N/A'}
                                        </span>
                                    </p>
                                    <p className="text-slate-600 dark:text-slate-300">
                                        <span className="font-medium">Status:</span>{' '}
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${well.status === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                                            well.status === 'warning' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
                                                'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                            }`}>
                                            {well.status}
                                        </span>
                                    </p>
                                    <p className="text-slate-600 dark:text-slate-300">
                                        <span className="font-medium">Critical Threshold:</span> {well.criticalDepth}m
                                    </p>
                                </div>
                            </div>
                        </Popup>
                    </CircleMarker>
                ))}
            </MapContainer>
        </div>
    );
};

export default MapView;
