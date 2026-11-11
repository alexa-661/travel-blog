import {Map, setWorkerUrl} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import { useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';

setWorkerUrl(workerUrl);



const GlobalMap = () => {
   const mapContainer = useRef<HTMLDivElement>(null);

   useEffect(() =>
   {
      if (!mapContainer.current) return;

      const map = new Map({
         container: mapContainer.current,
         style: 'https://demotiles.maplibre.org/style.json', // style URL
         center: [0, 0], // starting position [lng, lat]
         zoom: 0, // starting zoom
         rollEnabled: true,

      });

            // Add zoom and rotation controls to the map.
      map.addControl(new maplibregl.NavigationControl({
         visualizePitch: true,
         visualizeRoll: true,
         showZoom: true,
         showCompass: true
      }));

      return () => map.remove(); // Clean up the map instance on component unmount

   }, []);
      
  return (
      <div 
         ref={mapContainer}
         style={{ width: '100%', height: '400px' }}
      />
  );
};

export default GlobalMap;
