import React, { useState, useEffect, FormEvent } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { point, circle } from '@turf/turf';
import './App.css';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';

mapboxgl.accessToken = 'pk.eyJ1IjoiYXJpZGV2IiwiYSI6ImNtMG95cXdheTBkY3EyaXF5ZjRzZHEyb2UifQ.w-8TMZJ2AxoXmKBaKGopsw';


const DEFAULT_CENTER: [number, number] = [106.799412, -6.244669]; // Blok M coordinates

const App: React.FC = () => {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [longitude, setLongitude] = useState<number>(DEFAULT_CENTER[0]);
  const [latitude, setLatitude] = useState<number>(DEFAULT_CENTER[1]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapboxgl.supported()) {
      setError("Your browser does not support Mapbox GL");
      return;
    }

    try {
      const newMap = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: DEFAULT_CENTER,
        zoom: 15,
      });

      newMap.on('load', () => {
        setMap(newMap);
        console.log('Map loaded successfully');
      });

      newMap.on('error', (e) => {
        console.error('Mapbox error:', e);
        setError('An error occurred while loading the map');
      });

      return () => {
        newMap.remove();
        console.log('Map removed');
      };
    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Failed to initialize the map');
    }
  }, []);

  useEffect(() => {
    if (!map) return;
  
    const addCircle = () => {
      try {
        const center: [number, number] = [longitude, latitude];
        const centerPoint = point(center);
        const circleFeature = circle(centerPoint, 0.5);
  
        if (map.getLayer('circle-fill')) map.removeLayer('circle-fill');
        if (map.getLayer('circle-outline')) map.removeLayer('circle-outline');
        if (map.getSource('circle')) map.removeSource('circle');
  
        map.addSource('circle', { type: 'geojson', data: circleFeature });
  
        map.addLayer({
          id: 'circle-fill',
          type: 'fill',
          source: 'circle',
          paint: { 'fill-color': '#00b3fd', 'fill-opacity': 0.3 },
        });
  
        map.addLayer({
          id: 'circle-outline',
          type: 'line',
          source: 'circle',
          paint: { 'line-color': '#007cbf', 'line-width': 2 },
        });
  
        map.flyTo({ center: center, zoom: 11 });
        console.log('Circle added successfully');
      } catch (err) {
        console.error('Error adding circle:', err);
        setError('Failed to add circle to the map');
      }
    };
  
    // Check if the map is loaded before adding the circle
    if (map.loaded()) {
      addCircle();
    } else {
      map.once('load', addCircle);
    }
  }, [map, longitude, latitude]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted with:', { longitude, latitude });
  };

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className='App'>
      <h1 className='text-3xl font-bold underline'>Mapbox Circle Demo</h1>
      <div id='map' style={{ width: '1000px', height: '500px' }}></div>
      <div style={{ marginTop: '20px' }}>
        <form onSubmit={handleSubmit}>
          <span>Longitude</span>
          <Input
            type="number"
            value={longitude}
            onChange={(e) => setLongitude(parseFloat(e.target.value))}
            placeholder="Longitude"
            step="any"
          />
          <span>Latitude</span>
          <Input
            type="number"
            value={latitude}
            onChange={(e) => setLatitude(parseFloat(e.target.value))}
            placeholder="Latitude"
            step="any"
          />
          <Button type="submit" className='mt-3'>Update Map</Button>
        </form>
      </div>
    </div>
  );
};

export default App;