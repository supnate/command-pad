import React, { PureComponent } from 'react';
import { hashHistory } from 'react-router';
import { Button } from 'antd';

export default class Welcome extends PureComponent {
  render() {
    return (
      <div className="home-welcome">
        <h2>
          Welcome to Command Pad!
        </h2>
        <p>
          Command Pad is a central place for managing your command line programs.
        </p>
        <p>
          It's motivated by the need for running multiple dev servers for modern web development. Such as: Webpack dev-server, Storybook dev-server, Gitbook dev-server, API proxy server etc.
        </p>
        <p>
          It also could be used for other scenarios, such as running tests, launching Java apps, etc.
        </p>
        <p>
          Command Pad is an open source app. Any question or advice please visit the <a href="https://github.com/supnate/command-pad">project page</a> on GitHub.
        </p>
        <p>Now click below button to add your first command!</p>
        <p>
          <Button type="primary" onClick={() => hashHistory.push('/cmd/add')}>Add Command</Button> &nbsp;&nbsp;or&nbsp;&nbsp;
          <Button type="primary" onClick={this.props.onImportClick}>Import from package.json</Button>
        </p>
      </div>
    );
  }
}
