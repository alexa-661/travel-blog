import { useMemo } from 'react';
import { useAppSelector } from '../hooks/customHooks';

const CountryFilter = (Props: { selectedCountry: string, onCountryChange: (country: string) => void }) => {
   
   const articles = useAppSelector((state) => state.global.articles);
   const countryOptions = useMemo(() => new Set(articles.map((article) => article.country)), [articles]);

   return (
      <form>
         <label htmlFor="country" style={{ margin: '0 1rem' }}>Filter by Country:</label>
         <select
            id="country"
            value={Props.selectedCountry}
            onChange={(e) => {
               Props.onCountryChange(e.target.value);
            }}
         >
            <option value="">All Countries</option>
            {Array.from(countryOptions).map((country) => (
               <option key={country} value={country}>
                  {country}
               </option>
            ))}
         </select>
      </form>
   )
}

export default CountryFilter;