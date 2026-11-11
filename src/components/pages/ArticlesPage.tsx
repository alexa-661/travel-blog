import { useState } from "react";
import Articles from "../Articles"

const ArticlesPage = () => {
   const [selectedCountry, setSelectedCountry] = useState('');

   return (
      <Articles
         selectedCountry={selectedCountry}
         onCountryChange={setSelectedCountry}
      />
   )
}

export default ArticlesPage;