import { setSelectedLanguage } from "../store/globalSlice";
import { languageOptions } from "../constants/constants";
import { useAppDispatch, useAppSelector } from "../hooks/customHooks";

const LanguageButton = () =>
{
   const dispatch = useAppDispatch();
   const selectedLanguage = useAppSelector(state => state.global.selectedLanguage);
   const languageJSX = languageOptions.map((language: string) => <option key={language} value={language}>{language}</option>);

   const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
   {
      dispatch(setSelectedLanguage(e.target.value));
   };

   return (
      <select name="languages" onChange={handleLanguageChange} value={selectedLanguage}>
         {languageJSX}
      </select>
   )
}

export default LanguageButton;