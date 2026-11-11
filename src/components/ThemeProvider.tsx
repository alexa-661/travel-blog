import { createContext, useEffect, useState, type PropsWithChildren } from "react";

type Theme = 'light' | 'dark';

function getBrowserTheme(): Theme {
   return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
}
         
const ThemeContext = createContext<Theme | null>(null);

const ThemeProvider = ({ children }: PropsWithChildren) =>
{
   const [theme, setTheme] = useState<Theme>(getBrowserTheme());

   useEffect(() =>
   {
      const preference = window.matchMedia('(prefers-color-scheme: dark)')
      const updateTheme = () =>
      {
         setTheme(preference.matches ? 'dark' : 'light')
      }

      preference.addEventListener('change', updateTheme)
      document.documentElement.dataset.theme = preference.matches ? 'dark' : 'light'

      return () =>
      {
         preference.removeEventListener('change', updateTheme)
      }
   }, []);

   useEffect(() =>
   {
      document.documentElement.dataset.theme = theme
   }, [theme]);

    


   return (
      <ThemeContext.Provider value={theme}>
         {children}
      </ThemeContext.Provider>
   )

}

export default ThemeProvider;