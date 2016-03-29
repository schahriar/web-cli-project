function MapOrPolyfill() {
  let Map = window.Map;
  if ((!Map) || (typeof Map !== 'object')) {
    // Simple polyfill when ES6 Map is not available
    Map = class MapPolyfill {
      constructor() {
        this.map = {};
      }
      set(key, value) {
        this.map[key] = value;
      }
      get(key) {
        return this.map[key];
      }
      has(key) {
        return this.map.hasOwnProperty(key);
      }
      delete(key) {
        delete this.map[key];
      }
    };
  }
  return Map;
}

module.exports = MapOrPolyfill;