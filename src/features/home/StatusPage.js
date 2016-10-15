import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { hashHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Col, Form, Icon, Input, Modal, Popover, Row } from 'antd';
import memobind from 'memobind';
import { Link } from 'react-router';
import * as actions from './redux/actions';
import { findCmd } from './utils';
import Welcome from './Welcome';

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
    const cmd = this.props.home.cmdById[cmdId];
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

  handleDeleteCmd(cmdId) {
    const cmd = this.props.home.cmdById[cmdId];
    if (cmd.status !== 'stopped') {
      Modal.confirm({
        title: 'The command is running',
        content: 'Do you want stop and delete it?',
        okText: 'Ok',
        cancelText: 'Cancel',
        onOk: () => {
          this.props.actions.deleteCmd(cmdId);
        }
      });
    } else {
      this.props.actions.deleteCmd(cmdId);
    }
  }

  renderLoading() {
    return <div className="home-status-page loading">Loading...</div>;
  }

  renderOutput(cmd) {
    if (cmd.error) {
      let errMsg;
      if (cmd.error.errno === 'ENOENT') errMsg = 'failed to execute the command.';
      else errMsg = cmd.error.message || cmd.error.toString();
      return (
        <span className="output error">
          Error: {errMsg}
        </span>
      );
    }
    const outputs = cmd.outputs ? cmd.outputs.filter(c => !!c.text) : [];
    if (!outputs.length) return null;
    return (
      <span className="output">
        {_.last(outputs).text}
      </span>
    );
  }

  renderActionAction(cmd) {
    switch (cmd.status) {
      case 'running':
      case 'starting':
      case 'stopping':
        return (
          <Icon
            title="Stop"
            type="stop-circle"
            className="action-icon"
            onClick={memobind(this, 'handleStopCmd', cmd.id)}
          />
        );
        // return (
        //   <Icon
        //     type="loading"
        //     className="action-icon"
        //   />
        // );
      case 'stopped':
        return (
          <Icon
            title="Start"
            type="play-circle"
            className="action-icon"
            onClick={memobind(this, 'handleRunCmd', cmd.id)}
          />
        );
      default:
        return null;
    }
  }

  render() {
    const { home } = this.props;
    if (!home.appVersion) return this.renderLoading();
    const allCmds = home.cmdIds.map(id => home.cmdById[id]);

    return (
      <div className="home-status-page">
        <div className="header">
          <Link to="/cmd/add"><Icon type="plus" /></Link>
          <Icon type="setting" />
          <Icon type="edit" />
        </div>
        <div className="content-container" id="status-list-container">
          <ul className="cmd-list">
            {allCmds.map(cmd => (
              <li className={cmd.status || 'stopped'} key={cmd.id}>
                {this.renderActionAction(cmd)}

                <Link to={`/cmd/edit/${cmd.id}`} className="name">{cmd.name || cmd.cmd || 'No name.'}</Link>
                {this.renderOutput(cmd)}

                <div className="buttons">
                  <Icon type="delete" onClick={memobind(this, 'handleDeleteCmd', cmd.id)} />
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
            ))}
          </ul>
          {allCmds.length > 0 ?
            <div className="footer">
              Total: {allCmds.length} commands.
            </div>
          : <Welcome />
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
