/*
* storage.js
* wrapper on chrome's storage api, use more sensible key-value style,
* each api return Promise instead of using callback
*/

class Storage {

  constructor() {}

  /**
   * get and object by key from local storage
   * @param {string} key of the stored item
   * @return {Promise} a promise object resolves to the value of the stored item
   */
  get(key) {
    return new Promise((resolve, reject) => {
      if (!key || key === '') {
        console.warn('passing an empty or null key', key)
        resolve(null)
      } else {
        chrome.storage.local.get(key, (items) => {
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
   * store and object into local storage with {key}
   * @param {string} key the key used to store the object
   * @param {Object} value value of the object to store
   * @return {Promise} a promise object resolves to the stored item or rejects on failure
   */
  set(key, value) {
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
        chrome.storage.local.set(item, () => {
          console.debug('store item success')
          resolve(item)
        })
      }
    })
  }
}

var StorageInstance = new Storage()

export default StorageInstance
