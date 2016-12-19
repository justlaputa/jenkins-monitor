/*
* storage.js
* wrapper on chrome's storage api, use more sensible key-value style,
* each api return Promise instead of using callback
*/

class Storage {

  constructor() {
    this.local = chrome.storage.local
    this.sync = chrome.storage.sync
  }

  /**
   * get an object by key from the chrome storage
   * @param {string} key of the stored item
   * @param {Object} storage the storage object used to retrieve data, default use chrome local storage
   * @return {Promise} a promise object resolves to the value of the stored item
   */
  get(key, storage = this.local) {
    return new Promise((resolve, reject) => {
      if (!key || key === '') {
        console.warn('passing an empty or null key', key)
        resolve(null)
      } else {
        storage.get(key, (items) => {
          if (items && items[key]) {
            resolve(items[key])
          } else {
            console.error('failed to get item for key[%s] in local storage', key)
            reject()
          }
        })
      }
    })
  }

  /**
   * get an object by key from the chrome sync storage
   * @param {string} key key of the object to get
   * @return {Promise} a promise object resolves to the object value
   */
  getSync(key) {
    return this.get(key, this.sync)
  }

  /**
   * store and object into local storage with {key}
   * @param {string} key the key used to store the object
   * @param {Object} value value of the object to store
   * @return {Promise} a promise object resolves to the stored item or rejects on failure
   */
  set(key, value, storage = this.local) {
    return new Promise((resolve, reject) => {
      if (!key || key === '') {
        console.error('try to store value with an empty or null key, skip it')
        reject()
      } else {
        if (!value) {
          console.warn('try to store an null or undefined value for key[%s]', value, key)
        }
        let item = {}
        item[key] = value
        storage.set(item, () => {
          console.debug('store item success')
          resolve(item)
        })
      }
    })
  }

  /**
   * store and object into chrome sync storage with {key}
   * @param {string} key the key used to store the object
   * @param {Object} value value of the object to store
   * @return {Promise} a promise object resolves to the stored item or rejects on failure
   */
  setSync(key, value) {
    return this.set(key, value, this.sync)
  }
}

var StorageInstance = new Storage()

export default StorageInstance
