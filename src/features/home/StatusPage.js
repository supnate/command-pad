import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Icon } from 'antd';
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

  handleRunCmd(cmdId) {
    this.props.actions.runCmd(cmdId);
  }

  handleStopCmd(cmdId) {
    this.props.actions.stopCmd(cmdId);
  }

  renderLoading() {
    return <div className="home-status-page">Loading...</div>;
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
        <ul>
          {
            home.cmds.map(cmd => (
              <li className={cmd.status || 'stopped'} key={cmd.id}>
                {
                  cmd.status === 'running' ?
                  <Icon
                    type="stop-circle"
                    className="action-icon"
                    onClick={memobind(this, 'handleStopCmd', cmd.id)}
                  />
                  :
                  <Icon
                    type="play-circle"
                    className="action-icon"
                    onClick={memobind(this, 'handleRunCmd', cmd.id)}
                  />
                }
                
                <span className="name">{cmd.name || cmd.cmd || 'No name.'}</span>
                {this.renderOutput(cmd)}
                
                <div className="buttons">
                  <Icon type="eye-o" />
                </div>
              </li>
            ))
          }
        </ul>
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
