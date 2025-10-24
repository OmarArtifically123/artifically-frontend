import {
  THEME_DARK,
  THEME_LIGHT,
  THEME_CONTRAST,
  THEME_STORAGE_KEY,
  THEME_DEFAULT,
} from "@/context/themeConstants";

const PREFERRED_COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)";

const stringLiteral = (value: string) => JSON.stringify(value);

export function getThemeBootstrapScript(): string {
  const themeKey = stringLiteral(THEME_STORAGE_KEY);
  const darkValue = stringLiteral(THEME_DARK);
  const lightValue = stringLiteral(THEME_LIGHT);
  const contrastValue = stringLiteral(THEME_CONTRAST);
  const defaultValue = stringLiteral(THEME_DEFAULT);
  const prefersDarkQuery = stringLiteral(PREFERRED_COLOR_SCHEME_QUERY);

  return `(()=>{try{window.__SSR_DEBUG__=null;var doc=document.documentElement;if(!doc)return;var storage;try{storage=window.localStorage;}catch(_){}
var getStored=function(key){if(!storage)return null;try{return storage.getItem(key);}catch(_){return null;}};
var prefersDark=false;try{prefersDark=window.matchMedia&&window.matchMedia(${prefersDarkQuery}).matches;}catch(_){prefersDark=false;}
var storedTheme=getStored(${themeKey});var theme=storedTheme===${darkValue}||storedTheme===${lightValue}||storedTheme===${contrastValue}?storedTheme:${defaultValue};
doc.setAttribute("data-theme",theme);doc.className=doc.className.replace(/theme-(light|dark|contrast)/g,"");doc.classList.add("theme-"+theme);
if(document.body){document.body.dataset.theme=theme;}
window.__SSR_THEME__=theme;window.__SSR_SUCCESS__=true;}catch(error){window.__SSR_DEBUG__={themeBootstrapError:String(error)}}})();`;
}