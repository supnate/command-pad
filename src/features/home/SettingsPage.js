import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Icon } from 'antd';
import * as actions from './redux/actions';

export class SettingsPage extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  render() {
    return (
      <div className="rekit-page home-settings-page">
        <div className="header">
          <Link to="/"><Icon type="arrow-left" /></Link>
          <h1>Settings</h1>
        </div>
        <div className="page-content">
          Settings Page.
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
)(SettingsPage);
