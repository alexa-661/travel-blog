import {Map, setWorkerUrl} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import { useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import { useNavigate } from 'react-router';
import { articles } from '../assets/articles/articles';
import Articles from './Articles';

setWorkerUrl(workerUrl);



const GlobalMap = () => {
   const mapContainer = useRef<HTMLDivElement>(null);
   const navigate = useNavigate();

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

      const markers = articles.map((article) => {
         const popupContent = document.createElement('div');

         const title = document.createElement('strong');
         title.textContent = article.title;

         const location = document.createElement('p');
         location.textContent = `${article.city}, ${article.country}`;

         const link = document.createElement('a');
         link.href = `/articles/${article.slug}`;
         link.textContent = 'Read article';
         link.addEventListener('click', (event) => {
            event.preventDefault();
            navigate(`/articles/${article.slug}`);
         });

         popupContent.append(title, location, link);

         const popup = new maplibregl.Popup({ offset: 25 })
            .setDOMContent(popupContent);

         return new maplibregl.Marker()
            .setLngLat([
               article.coordinates.longitude,
               article.coordinates.latitude,
            ])
            .setPopup(popup)
            .addTo(map);
      });

      return () => {
         markers.forEach((marker) => marker.remove());
         map.remove();
      };

   }, [navigate]);
      
  return (
      <>
         <div 
            ref={mapContainer}
            style={{ width: '100%', height: '400px' }}
         />
         <Articles />
      </>
  );
};

export default GlobalMap;
