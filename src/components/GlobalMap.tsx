import {Map, setWorkerUrl} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import { useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import { useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '../hooks/customHooks';
import { fetchCoordinates } from '../store/globalSlice';

setWorkerUrl(workerUrl);

const DEFAULT_MAP_CENTER: [number, number] = [-3, 30];
const DEFAULT_MAP_ZOOM = 0;

const GlobalMap = (Props: { selectedCountry: string | null }) => {
   const mapContainer = useRef<HTMLDivElement>(null);
   const mapRef = useRef<Map | null>(null);
   const navigate = useNavigate();
   const articles = useAppSelector((state) => state.global.articles);
   const articlesStatus = useAppSelector((state) => state.global.articlesStatus);
   const coordinatesStatus = useAppSelector((state) => state.global.coordinatesStatus);
   const dispatch = useAppDispatch();

   useEffect(() =>
   {
      const container = mapContainer.current;
      if (!container) return;

      const map = new Map({
         container: container,
         style: 'https://demotiles.maplibre.org/style.json',
         center: DEFAULT_MAP_CENTER,
         zoom: DEFAULT_MAP_ZOOM,
         rollEnabled: true,
         renderWorldCopies: false,
         attributionControl: {
            compact: false,
            customAttribution: [
               '<a href="https://maplibre.org/" target="_blank" rel="noopener noreferrer">MapLibre</a>',
               'Geocoding: &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a>',
            ],
         },
      });

      mapRef.current = map;

      map.once('load', () => {
         map.setPaintProperty('background', 'background-color', '#F2E6D8');
         map.setPaintProperty('countries-fill', 'fill-color', '#68A69B');
         map.setPaintProperty('countries-boundary', 'line-color', '#2D6673');
         map.setPaintProperty('countries-label', 'text-color', '#2D6673');
         map.setPaintProperty('countries-label', 'text-halo-color', '#F2E6D8');
         map.setPaintProperty('geolines-label', 'text-color', '#D96A29');
      });

      map.addControl(new maplibregl.NavigationControl({
         visualizePitch: true,
         visualizeRoll: true,
         showZoom: true,
         showCompass: true
      }));

      const markers = articles.flatMap((article) => {
         if (article.coordinates === null)
         {
            return [];
         }
         const popupContent = document.createElement('div');

         const title = document.createElement('strong');
         title.textContent = article.title;

         const location = document.createElement('p');
         location.textContent = `${article.location.city}, ${article.location.country}`;

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

         return [
            new maplibregl.Marker({ color: '#D93232' })
               .setLngLat([
                  article.coordinates.longitude,
                  article.coordinates.latitude,
               ])
               .setPopup(popup)
               .addTo(map),
         ];
      });

      map.once('idle', () =>
      {
         if (container) {
            container.style.opacity = '1';
         }
      });

      return () => {
         if (container)
         {
            container.style.opacity = '0';
         }
         markers.forEach((marker) => marker.remove());
         mapRef.current = null;
         map.remove();
      };

   }, [navigate, articles]);

   useEffect(() => {
      const map = mapRef.current;
      if (!map) return;

      if (!Props.selectedCountry || Props.selectedCountry === null)
      {
         map.flyTo({
            center: DEFAULT_MAP_CENTER,
            zoom: DEFAULT_MAP_ZOOM,
            duration: 1000,
         });
         return;
      }

      const coordinates = articles
         .flatMap((article) => (article.location.country === Props.selectedCountry && article.coordinates !== null ? [article.coordinates] : []));
      
      if (coordinates.length === 0) return;

      if (coordinates.length === 1)
      {
         const { longitude, latitude } = coordinates[0];
         map.flyTo({
            center: [longitude, latitude],
            zoom: 6,
            duration: 1000,
         });
         return;
      }

      const bounds = new maplibregl.LngLatBounds();
      coordinates.forEach(({ longitude, latitude }) =>
      {
         bounds.extend([longitude, latitude]);
      });

      map.fitBounds(bounds, { padding: 40, maxZoom: 6, duration: 1000 });
   }, [Props.selectedCountry, articles]);

   useEffect(()=>
   {
      if ( articlesStatus !== 'succeeded' || articles.length === 0 || coordinatesStatus !== 'idle')
      {
         return;
      }
      const locations = articles.map((article) => article.location);
      dispatch(fetchCoordinates(locations));
   }, [articles, dispatch, articlesStatus, coordinatesStatus])
      
   return (
      <div
         ref={mapContainer}
         style={{ width: '100%', height: '400px', opacity: 0, transition: 'opacity 150ms ease' }}
      />
   );
};

export default GlobalMap;
