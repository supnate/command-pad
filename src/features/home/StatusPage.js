import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { hashHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Col, Form, Icon, Input, Modal, Popover, Row } from 'antd';
import memobind from 'memobind';
import { Link } from 'react-router';
import CmdList from './CmdList';
import * as actions from './redux/actions';
import { findCmd } from './utils';
import Welcome from './Welcome';

export class StatusPage extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleBeginEdit = this.handleBeginEdit.bind(this);
    this.handleEndEdit = this.handleEndEdit.bind(this);
  }

  state = {
    editing: false,
  };

  componentDidMount() {
    if (!this.props.home.appVersion) {
      this.props.actions.getInitData()
        .then(() => this.setState({
          cmds: this.props.home.cmdIds.map(id => this.props.home.cmdById[id]).slice(),
        }));
    }
  }

  handleBeginEdit() {
    this.setState({
      editing: true,
    });
  }

  handleEndEdit() {
    this.setState({
      editing: false,
    });
  }

  renderLoading() {
    return <div className="home-status-page loading"></div>;
  }

  render() {
    const { home } = this.props;
    const { runCmd, stopCmd, deleteCmd, reorderCmds } = this.props.actions;
    const { editing } = this.state;
    if (!home.appVersion) return this.renderLoading();

    const allCmds = home.cmdIds.map(id => home.cmdById[id]);

    return (
      <div className="rekit-page home-status-page">
        <div className="header">
          {!editing && <Link to="/cmd/add"><Icon type="plus" /></Link>}
          {!editing && <Link to="/about"><Icon type="info-circle-o" title="About" /></Link>}
          {!editing && allCmds.length > 0 && <Icon type="edit" title="Edit" onClick={this.handleBeginEdit} />}
          {editing && <Button type="primary" size="small" onClick={this.handleEndEdit} style={{ float: 'right' }}>End Editing</Button>}
        </div>
        <div className="page-content" id="status-list-container">
          <CmdList
            cmds={allCmds}
            runCmd={runCmd}
            stopCmd={stopCmd}
            deleteCmd={deleteCmd}
            reorderCmds={reorderCmds}
            editing={editing}
          />
          {(allCmds.length > 0 || editing )?
            <div className="footer">
              Total {allCmds.length} command{allCmds.length > 1 ? 's' : ''}, {allCmds.filter(c => c.status === 'running').length} running.
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
