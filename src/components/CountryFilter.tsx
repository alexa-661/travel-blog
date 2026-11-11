import { useMemo } from 'react';
import { articles } from '../assets/articles/articles';

const CountryFilter = (Props: { selectedCountry: string, onCountryChange: (country: string) => void }) => {
   
   const countryOptions = useMemo(() => new Set(articles.map((article) => article.country)), []);

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
      
   );

}

export default CountryFilter;