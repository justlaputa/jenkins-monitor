/*
* storage.js
* wrapper on chrome's storage api, use more sensible key-value style,
* each api return Promise instead of using callback
*/

class Storage {

  constructor() {}

  get(key) {
    return null;
  }

  set(key, value) {
    return;
  }
}

var StorageInstance = new Storage();

export default StorageInstance;
