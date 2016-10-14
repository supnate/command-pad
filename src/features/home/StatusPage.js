import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { hashHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Col, Form, Icon, Input, Popover, Row } from 'antd';
import memobind from 'memobind';
import { Link } from 'react-router';
import * as actions from './redux/actions';
import { findCmd } from './utils';

export class StatusPage extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  state = {
    editing: false,
  };

  componentDidMount() {
    if (!this.props.home.appVersion) {
      this.props.actions.getInitData();
    }
  }

  getOutputPopover(cmdId) {
    const cmd = findCmd(this.props.home.cmds, cmdId);
    if (!cmd.outputs || !cmd.outputs.length) return null;
    return (
      <ul className="output-list">
        {
          cmd.outputs.map(line => <li key={line.id}>{line.text}</li>)
        }
      </ul>
    );
  }

  getTooltipContainer() {
    return document.getElementById('status-list-container');
  }

  handleRunCmd(cmdId) {
    this.props.actions.runCmd(cmdId);
  }

  handleStopCmd(cmdId) {
    this.props.actions.stopCmd(cmdId);
  }

  renderLoading() {
    return <div className="home-status-page loading">Loading...</div>;
  }

  renderOutput(cmd) {
    const outputs = cmd.outputs ? cmd.outputs.filter(c => !!c.text) : [];
    if (!outputs.length) return null;
    return (
      <span className="output">
        {_.last(outputs).text}
      </span>
    );
  }

  render() {
    const { home } = this.props;
    if (!home.appVersion) return this.renderLoading();
    return (
      <div className="home-status-page">
        <div className="header">
          <Link to="/cmd/add"><Icon type="plus" /></Link>
          <Icon type="setting" />
          <Icon type="edit" />
        </div>
        <div className="content-container" id="status-list-container">
          <ul className="cmd-list">
            {
              home.cmds.map(cmd => (
                <li className={cmd.status || 'stopped'} key={cmd.id}>
                  {cmd.status === 'running' ?
                    <Icon
                      title="Stop"
                      type="stop-circle"
                      className="action-icon"
                      onClick={memobind(this, 'handleStopCmd', cmd.id)}
                    />
                  :
                    <Icon
                      title="Start"
                      type="play-circle"
                      className="action-icon"
                      onClick={memobind(this, 'handleRunCmd', cmd.id)}
                    />
                  }

                  <Link to={`/cmd/edit/${cmd.id}`} className="name">{cmd.name || cmd.cmd || 'No name.'}</Link>
                  {this.renderOutput(cmd)}

                  <div className="buttons">
                    {
                      cmd.outputs && cmd.outputs.length > 0 &&
                      <Popover
                        trigger="hover"
                        content={this.getOutputPopover(cmd.id)}
                        placement="left"
                        getTooltipContainer={this.getTooltipContainer}
                        arrowPointAtCenter
                      >
                        <Icon type="eye-o" />
                      </Popover>
                    }
                  </div>
                </li>
              ))
            }
          </ul>
          {home.cmds.length > 0 ?
            <div className="footer">
              Total: {home.cmds.length} commands.
            </div>
          :
            <div className="welcome">
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
          }
        </div>
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    home: state.home,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StatusPage);
