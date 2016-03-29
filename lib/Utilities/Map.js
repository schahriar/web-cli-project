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
      forEach(callback) {
        Object.keys(this.map).forEach((key) => {
          // Call according to ES6 Map#forEach
          callback(this.map[key], key, this);
        });
      }
    };
  }
  return Map;
}

module.exports = MapOrPolyfill;