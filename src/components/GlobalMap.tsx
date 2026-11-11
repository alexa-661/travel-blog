import {Map, setWorkerUrl} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import { useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import { useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '../hooks/customHooks';
import { fetchCoordinates } from '../store/globalSlice';

setWorkerUrl(workerUrl);

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
            new maplibregl.Marker()
               .setLngLat([
                  article.coordinates.longitude,
                  article.coordinates.latitude,
               ])
               .setPopup(popup)
               .addTo(map),
         ];
      });

      return () => {
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
         (article) => article.location.country === Props.selectedCountry
      )
   
      if (locations.length === 0) return;
   
      if (locations.length > 0)
      {
         const { longitude, latitude } = locations[0].coordinates ?? { latitude: 0, longitude: 0};
         map.flyTo({
            center: [longitude, latitude],
            zoom: 6,
            duration: 1000,
         })
      }

      const bounds = new maplibregl.LngLatBounds();
      locations.forEach(({ coordinates }) =>
      {
         if (coordinates !== null)
         {
            bounds.extend([coordinates.longitude, coordinates.latitude]);
         }
      })

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
      <>
         <div 
            ref={mapContainer}
            style={{ width: '100%', height: '400px' }}
         />
         <p>
            Geocoding: ©
            <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">
               OpenStreetMap contributors
            </a>
         </p>
      </>
   );
};

export default GlobalMap;
