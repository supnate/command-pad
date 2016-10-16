import React, { Component, PropTypes } from 'react';
import { hashHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Icon } from 'antd';
import * as actions from './redux/actions';
import ALink from './ALink';

export class AboutPage extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  render() {
    return (
      <div className="rekit-page home-about-page">
        <div className="header">
          <Icon type="close" onClick={() => hashHistory.push('/')} style={{ float: 'right' }} />
          <h1>About</h1>
        </div>
        <div className="page-content">
          <div className="title-wrapper">
            <img src={require('../../images/logo.png')} alt="logo" className="logo" />
            <h2>Command Pad</h2>
            <div>Version 0.1.1</div>
          </div>
          <p>Command Pad is a central place for managing all of your command line apps.</p>
          <p>Any questions or advice? Please visit:</p>
          <ALink url="https://github.com/supnate/command-pad">https://github.com/supnate/command-pad</ALink>
          <h3>Powered by</h3>
          <p className="powered-by">
            <ALink url="https://github.com/electron/electron">
              <img alt="electron logo" src={require('../../images/electron_logo.png')} />
            </ALink>
            <br />
            <ALink url="https://github.com/supnate/rekit">
              <img alt="rekit logo" className="rekit-logo" src={require('../../images/rekit_logo.png')} />
            </ALink>
          </p>
          <h3>Creator</h3>
          <p>
            Nate Wang (<ALink url="https://twitter.com/@webows">@webows</ALink>)
          </p>
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
)(AboutPage);
