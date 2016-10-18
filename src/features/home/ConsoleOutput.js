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

  render() {
    return (
      <div className="home-console-output">
        <Icon type="close-circle" className="clear-icon" title="Clear Output" onClick={this.props.onClear} />
        <div className="output-wrapper" ref={scrollNode => this.scrollNode = scrollNode}>
          <ul className="output-list">
            {
              this.props.lines.map(line => <li key={line.id} dangerouslySetInnerHTML={{__html: line.text}} />)
            }
          </ul>
        </div>
      </div>
    );
  }
}
