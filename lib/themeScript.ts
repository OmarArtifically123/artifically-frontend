import {
  CONTRAST_DEFAULT,
  CONTRAST_HIGH,
  CONTRAST_STORAGE_KEY,
  THEME_DARK,
  THEME_LIGHT,
  THEME_STORAGE_KEY,
} from "@/context/themeConstants";

const PREFERRED_COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)";
const PREFERRED_CONTRAST_QUERY = "(prefers-contrast: more)";

const stringLiteral = (value: string) => JSON.stringify(value);

export function getThemeBootstrapScript(): string {
  const themeKey = stringLiteral(THEME_STORAGE_KEY);
  const contrastKey = stringLiteral(CONTRAST_STORAGE_KEY);
  const darkValue = stringLiteral(THEME_DARK);
  const lightValue = stringLiteral(THEME_LIGHT);
  const contrastHighValue = stringLiteral(CONTRAST_HIGH);
  const contrastDefaultValue = stringLiteral(CONTRAST_DEFAULT);
  const prefersDarkQuery = stringLiteral(PREFERRED_COLOR_SCHEME_QUERY);
  const prefersContrastQuery = stringLiteral(PREFERRED_CONTRAST_QUERY);

  return `(()=>{try{window.__SSR_DEBUG__=null;var doc=document.documentElement;if(!doc)return;var storage;try{storage=window.localStorage;}catch(_){}
var getStored=function(key){if(!storage)return null;try{return storage.getItem(key);}catch(_){return null;}};
var prefersDark=false;try{prefersDark=window.matchMedia&&window.matchMedia(${prefersDarkQuery}).matches;}catch(_){prefersDark=false;}
var storedTheme=getStored(${themeKey});var theme=storedTheme===${darkValue}||storedTheme===${lightValue}?storedTheme:(prefersDark?${darkValue}:${lightValue});
doc.setAttribute("data-theme",theme);if(document.body){document.body.dataset.theme=theme;}
var prefersHighContrast=false;try{prefersHighContrast=window.matchMedia&&window.matchMedia(${prefersContrastQuery}).matches;}catch(_){prefersHighContrast=false;}
var storedContrast=getStored(${contrastKey});var contrast=storedContrast===${contrastHighValue}||storedContrast===${contrastDefaultValue}?storedContrast:(prefersHighContrast?${contrastHighValue}:${contrastDefaultValue});
doc.setAttribute("data-contrast",contrast);if(document.body){document.body.dataset.contrast=contrast;}
try{storage&&storage.setItem(${themeKey},theme);}catch(_){/* no-op */}
try{storage&&storage.setItem(${contrastKey},contrast);}catch(_){/* no-op */}
window.__SSR_THEME__=theme;window.__SSR_CONTRAST__=contrast;window.__SSR_SUCCESS__=true;}catch(error){window.__SSR_DEBUG__={themeBootstrapError:String(error)}}})();`;
}