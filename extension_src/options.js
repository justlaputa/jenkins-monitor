/*
* options.js
* common function to manage extension options.
*/

import Storage from './storage';

const JENKINS_KEY = 'options.jenkins'
const NOTIFICATION_KEY = 'options.notification'

class Options {

  constructor() {}

  getAll() {
    return Promise.all(
      Storage.getSync(JENKINS_KEY),
      Storage.getSync(NOTIFICATION_KEY)
    ).then((j, n) => {
      return {
        jenkins: j,
        notification: n
      }
    })
  }

  getJenkins() {
    return Storage.getSync(JENKINS_KEY)
  }

  getNotification() {
    return Storage.getSync(NOTIFICATION_KEY)
  }

  setJenkins() {
    return Storage.setSync(JENKINS_KEY)
  }

  setNotification() {
    return Storage.setSync(NOTIFICATION_KEY)
  }
}

export default new Options();
