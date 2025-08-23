// js/jquery-shim.js
// Ce fichier sert de pont (shim) entre jQuery global et les imports ES modules.

if (!window.jQuery) {
  throw new Error(
    "jQuery n'est pas chargé. Assure-toi que ./js/vendor/jquery.min.js est inclus avant les modules."
  );
}

// Export par défaut pour pouvoir faire: import $ from './jquery-shim.js'
const $ = window.jQuery;
export default $;
export { $ }; // optionnel: export nommé aussi
