import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Icon } from 'antd';
import * as actions from './redux/actions';

export class StatusPage extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  state = {
    editing: false,
  };

  render() {
    const data = [];
    for (let i = 0; i < 10; i++) {
      data.push({

      });
    }
    console.log('process: ', process)
    return (
      <div className="home-status-page">
        <div className="header">
          <Icon type="plus" />
          <Icon type="setting" />
          <Icon type="edit" />
        </div>
        <ul>
          <li className="stopped">
            <Icon type="play-circle" className="action-icon" />
            <span className="title">{process.title}</span>
            <div className="buttons">
              <Icon type="edit" />
              <Icon type="delete" />
              <Icon type="eye-o" />
            </div>
          </li>
          <li className="error">
            <Icon type="close-circle" className="action-icon" />
            <span className="title">anw-ui-core webpack-only</span>
            <span className="output">Last run: 5 days ago.</span>
          </li>
          <li className="running">
            <Icon type="check-circle" className="action-icon" />
            <span className="title">anw-ui-core webpack-only</span>
          </li>
          <li className="error">
            <Icon type="close-circle" className="action-icon" />
            <span className="title">anw-ui-core webpack-only</span>
          </li>
          <li className="running">
            <Icon type="check-circle" className="action-icon" />
            <span className="title">anw-ui-core webpack-only</span>
          </li>
          <li className="error">
            <Icon type="close-circle" className="action-icon" />
            <span className="title">anw-ui-core webpack-only</span>
          </li>
          <li className="running">
            <Icon type="check-circle" className="action-icon" />
            <span className="title">anw-ui-core webpack-only</span>
          </li>
          <li className="error">
            <Icon type="close-circle" className="action-icon" />
            <span className="title">anw-ui-core webpack-only</span>
          </li>
          <li className="running">
            <Icon type="check-circle" className="action-icon" />
            <span className="title">anw-ui-core webpack-only</span>
          </li>
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
