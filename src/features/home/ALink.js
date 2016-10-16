import React, { PureComponent, PropTypes } from 'react';

export default class ALink extends PureComponent {
  static propTypes = {
    children: PropTypes.any,
    url: PropTypes.string,
    className: PropTypes.string,
  };

  static defaultProps = {
    className: '',
  };

  constructor(props) {
    super(props);
    this.openUrl = this.openUrl.bind(this);
  }

  openUrl() {
    bridge.openUrl(this.props.url);
  }

  render() {
    return (
      <a href="javascript:void(0)" onClick={this.openUrl} className={this.props.className}>
        {this.props.children || ''}
      </a>
    );
  }
}
