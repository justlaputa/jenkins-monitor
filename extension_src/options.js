/*
* options.js
* common function to manage extension options.
*/

import Storage from './storage';

const JENKINS_KEY = 'options.jenkinses'
const NOTIFICATION_KEY = 'options.notifications'

class Options {

  constructor() {}

  getAll() {
    return Promise.all([
      this.getJenkins(),
      this.getNotification()
    ]).then((result) => {
      return {
        jenkinses: result[0],
        notifications: result[1]
      }
    }).catch(() => {
      console.warn('could not get all options')
    })
  }

  setAll(data) {
    return Promise.all([
      this.setJenkins(data['jenkinses']),
      this.setNotification(data['notifications'])
    ])
  }

  getJenkins() {
    return Storage.getSync(JENKINS_KEY)
  }

  getNotification() {
    return Storage.getSync(NOTIFICATION_KEY)
  }

  setJenkins(value) {
    return Storage.setSync(JENKINS_KEY, value)
  }

  setNotification(value) {
    return Storage.setSync(NOTIFICATION_KEY, value)
  }
}

export default new Options();
