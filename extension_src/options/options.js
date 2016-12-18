/*
* options.js
* interact with user's preference settings in the options html page
*
* when user input or modify preferences in the options.html page, it
* stores the data into chrome shared local storage.
* when user's preference changes, it send message to both popup page
* and background event page, so the popup page can change the necessary
* UI component to show the change, and background page can reload the
* configuration for background process, like remove/add jenkins server
* url, change refresh time interval, etc.
*/

import React from 'react';
import ReactDOM from 'react-dom';

class OptionsForm extends React.Component {
  constructor() {
    super()
    this.state = {
      jenkinses: [{
        url: 'http://example.jenkins.com',
        refresh: 5,
        example: true
      }],
      notifications: {}
    }
    this.onJenkinsOptionsChange = this.onJenkinsOptionsChange.bind(this)
    this.onNotificationOptionsChange = this.onNotificationOptionsChange.bind(this)
  }

  onJenkinsOptionsChange(index, value) {
    console.log('got jenkins options change for index [%d] to %O:', index, value)
    let oldItem = this.state.jenkinses[index]
    let newItem = Object.assign({}, oldItem, value)

    //make a copy of current jenkins settings, prevent mutate existing state
    let newJenkinses = [...this.state.jenkinses]

    if (newItem.example) {
      delete newItem['example']
    }

    newJenkinses.splice(index, 1, newItem)

    console.debug('set state to new jenkinses state: %O', newJenkinses)
    this.setState({
      jenkinses: newJenkinses,
      notification: this.state.notification
    })
  }

  onNotificationOptionsChange(value) {
    console.log('get notification change', value)
  }

  render() {
    return (
      <div className="options-form">
        <JenkinsUrls
          jenkinses={this.state.jenkinses}
          onChange={this.onJenkinsOptionsChange}>
        </JenkinsUrls>
        <NotificationOptions
          notifications={this.state.notifications}
          onChange={this.onNotificationOptionsChange}>
        </NotificationOptions>
      </div>
    )
  }
}

const JenkinsUrls = function(props) {
  const urlList = props.jenkinses.map((jenkins, index) =>
    <div key={index}
      className={"jenkins-url " + jenkins.example ? "example" : ""}>
      <input className="jenkins-url" type="text"
        onChange={(event) => props.onChange(index, {url: event.target.value})}
        value={jenkins.url}></input>
      <input className="refresh-time" type="number"
        min="5" max="30" step="5"
        onChange={(event) => props.onChange(index, {refresh: parseInt(event.target.value, 10)})}
        value={jenkins.refresh}>
      </input>
      <span>minutes</span>
    </div>
  )
  return (
    <div className="jenkins-urls">
      {urlList}
    </div>
  )
}

class NotificationOptions extends React.Component {
  render() {
    return (
      <div className="notification-options">
        Notification settings here
      </div>
    )
  }
}

ReactDOM.render(<OptionsForm/>, document.getElementById('main'));
