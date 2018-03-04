import React, { PureComponent, PropTypes } from 'react';
import { Icon } from 'antd';

export default class ConsoleOutput extends PureComponent {
  static propTypes = {
    lines: PropTypes.array.isRequired,
    onClear: PropTypes.func,
  };

  static defaultProps = {
    lines: [],
    onClear() {},
  };

  componentDidUpdate() {
    const n = this.scrollNode;
    if (n.scrollHeight - n.scrollTop < n.offsetHeight * 1.8) {
      n.scrollTop = n.scrollHeight;
    }
  }

  scrollTop = () => {
    this.scrollNode.scrollTop = 0;
  };
  scrollBottom = () => {
    this.scrollNode.scrollTop = this.scrollNode.scrollHeight;
  };

  render() {
    if (!this.props.lines.length) {
      return (
        <div className="home-console-output">
          <div className="empty">Not started or no output.</div>
        </div>
      );
    }
    return (
      <div className="home-console-output">
        <Icon type="close" className="clear-icon" title="Clear Output" onClick={this.props.onClear} />
        <Icon type="arrow-up" title="Scroll to Top" onClick={this.scrollTop} />
        <Icon type="arrow-down" title="Scroll to Bottom" onClick={this.scrollBottom} />
        <div className="output-wrapper" ref={scrollNode => (this.scrollNode = scrollNode)}>
          <ul className="output-list">
            {this.props.lines.map(line => <li key={line.id} dangerouslySetInnerHTML={{ __html: line.text }} />)}
          </ul>
        </div>
      </div>
    );
  }
}
