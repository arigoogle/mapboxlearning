import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import './App.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiYXJpZGV2IiwiYSI6ImNtMG95cXdheTBkY3EyaXF5ZjRzZHEyb2UifQ.w-8TMZJ2AxoXmKBaKGopsw';

function App() {
  useEffect(() => {
    // Initialize the map
    const map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: [106.799412, -6.244669], // starting position [longitude, latitude] Blok M
      zoom: 15, // starting zoom
    });

    // Once the map is loaded, add the circle
    map.on('load', () => {
      const center = [106.799412, -6.244669]; // Blok M coordinates

      // Create a circle using Turf.js
      const circle = turf.circle(center, 0.5, {
        steps: 64, // smooth circle
        units: 'kilometers', // 0.5 km = 500 meters
      });

      // Add the circle as a GeoJSON data source
      map.addSource('circle', {
        type: 'geojson',
        data: circle,
      });

      // Add the circle to the map as a fill layer
      map.addLayer({
        id: 'circle-fill',
        type: 'fill',
        source: 'circle',
        layout: {},
        paint: {
          'fill-color': '#00b3fd', // color
          'fill-opacity': 0.3, // transparency
        },
      });

      // Add an outline for the circle
      map.addLayer({
        id: 'circle-outline',
        type: 'line',
        source: 'circle',
        layout: {},
        paint: {
          'line-color': '#007cbf',
          'line-width': 2,
        },
      });
    });

    // Cleanup on unmount
    return () => map.remove();
  }, []);

  return (
    <div className="App">
      <div id="map" style={{ width: '100vw', height: '100vh' }}></div>
    </div>
  );
}

export default App;