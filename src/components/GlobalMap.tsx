import {Map, setWorkerUrl} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import { useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import { useNavigate } from 'react-router';
import { articles } from '../assets/articles/articles';

setWorkerUrl(workerUrl);

const GlobalMap = (Props: { selectedCountry: string | null }) => {
   const mapContainer = useRef<HTMLDivElement>(null);
   const mapRef = useRef<Map | null>(null);
   const navigate = useNavigate();

   useEffect(() =>
   {
      if (!mapContainer.current) return;

      const map = new Map({
         container: mapContainer.current,
         style: 'https://demotiles.maplibre.org/style.json', // style URL
         center: [-3.7, 40.4], // starting position [lng, lat]
         zoom: -1 , // starting zoom
         rollEnabled: true,
         renderWorldCopies: false,
      });

      mapRef.current = map;

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
         mapRef.current = null;
         map.remove();
      };

   }, [navigate]);

   useEffect(() => {
      const map = mapRef.current;
      if (!map) return;

      if (!Props.selectedCountry || Props.selectedCountry === null)
      {
         map.fitBounds([[-180, -85.051129], [180, 85.051129]],
            { padding: 0, duration: 1000 });

         //          map.flyTo({
         //   center: [-3.7, 40.4],
         //   zoom: -1,
         //   duration: 1000,
         // })

         //             map.once('moveend', () => {
         //   console.log('zoom:', map.getZoom(), 'bounds:', map.getBounds().toArray())
         // })

        return;
      }
   
      const locations = articles.filter(
        (article) => article.country === Props.selectedCountry
      )
   
      if (locations.length === 0) return;
   
      if (locations.length > 0)
      {
        const { longitude, latitude } = locations[0].coordinates
        map.flyTo({
          center: [longitude, latitude],
          zoom: 6,
          duration: 1000,
        })
      }

   const bounds = new maplibregl.LngLatBounds();
   locations.forEach(({ coordinates }) =>
   {
      bounds.extend([coordinates.longitude, coordinates.latitude]);
   })

   map.fitBounds(bounds, { padding: 40, maxZoom: 6, duration: 1000 });
}, [Props.selectedCountry]);
      
  return (
      <>
         <div 
            ref={mapContainer}
            style={{ width: '100%', height: '400px' }}
         />
      </>
  );
};

export default GlobalMap;
