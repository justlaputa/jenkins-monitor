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
    return null;
  }

  getNotification() {
    return null;
  }
}

export default new Options();
