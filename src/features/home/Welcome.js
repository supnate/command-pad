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
          Command Pad is a central place for managing all of your command line apps.
        </p>
        <p>
          It's motivated by the need to run multiple dev servers while developing <a href="https://facebook.github.io/react/index.html">React</a> applications. Such as: Webpack dev-server, Storybook dev-server, Gitbook dev-server, API proxy server etc.
        </p>
        <p>
          It's also suitable for other command line scenarios, such as running tests, launch Java apps, etc.
        </p>
        <p>
          Command Pad is an open source app. Any question or advice please visit the <a href="https://github.com/supnate/command-pad">project page</a> on GitHub.
        </p>
        <p>Now click below button to add your first command!</p>
        <p>
          <Button type="primary" onClick={() => hashHistory.push('/cmd/add')}>Add Command</Button>
        </p>
      </div>
    );
  }
}
