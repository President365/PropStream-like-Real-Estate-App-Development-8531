import React, { useEffect, useRef } from 'react';

const PropertyMap = ({ properties, height = "400px" }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.L && mapRef.current) {
      // Initialize map if not already done
      if (!mapInstanceRef.current) {
        mapInstanceRef.current = window.L.map(mapRef.current).setView([30.2672, -97.7431], 12);
        
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(mapInstanceRef.current);
      }

      // Clear existing markers
      mapInstanceRef.current.eachLayer((layer) => {
        if (layer instanceof window.L.Marker) {
          mapInstanceRef.current.removeLayer(layer);
        }
      });

      // Add property markers
      if (properties && properties.length > 0) {
        properties.forEach((property) => {
          if (property.coordinates) {
            const marker = window.L.marker(property.coordinates).addTo(mapInstanceRef.current);
            marker.bindPopup(`
              <div class="p-2">
                <h3 class="font-semibold">${property.address}</h3>
                <p class="text-sm text-gray-600">${property.city}, ${property.state}</p>
                <p class="font-bold text-lg">$${property.price.toLocaleString()}</p>
                <p class="text-sm">${property.bedrooms} bed • ${property.bathrooms} bath • ${property.sqft.toLocaleString()} sqft</p>
              </div>
            `);
          }
        });

        // Fit map to show all properties
        if (properties.length > 1) {
          const group = new window.L.featureGroup(
            properties
              .filter(p => p.coordinates)
              .map(p => window.L.marker(p.coordinates))
          );
          mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
        }
      }
    }
  }, [properties]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div 
      ref={mapRef} 
      style={{ height }}
      className="rounded-lg border border-gray-200"
    />
  );
};

export default PropertyMap;