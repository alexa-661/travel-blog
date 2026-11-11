import { setSelectedLanguage } from "../store/globalSlice";
import { languageOptions, STORAGE_KEY } from "../constants/constants";
import { useAppDispatch, useAppSelector } from "../hooks/customHooks";

const LanguageButton = () =>
{
   const dispatch = useAppDispatch();
   const selectedLanguage = useAppSelector(state => state.global.selectedLanguage);
   const languageJSX = languageOptions.map((language: string) => <option key={language} value={language}>{language}</option>);

   const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
   {
      const language = languageOptions.find((option) => option === e.target.value);
      if (!language) return;
      dispatch(setSelectedLanguage(language));
      localStorage.setItem(STORAGE_KEY, language);
   };

   return (
      <select name="languages" onChange={handleLanguageChange} value={selectedLanguage}>
         {languageJSX}
      </select>
   )
}

export default LanguageButton;