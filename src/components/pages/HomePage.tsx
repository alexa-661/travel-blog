import { useState } from "react";
import Articles from "../Articles"
import GlobalMap from "../GlobalMap"


const HomePage = () => {
   const [selectedCountry, setSelectedCountry] = useState<string>('');
   const handleCountryChange = (country: string) =>
   {
      setSelectedCountry(country);
   }

   return (
      <>
         <GlobalMap selectedCountry={selectedCountry} />
         <Articles selectedCountry={selectedCountry} onCountryChange={handleCountryChange} />
      </>
   )
};

export default HomePage;