import React, { PureComponent } from 'react';
import { Button, Icon } from 'antd';

export default class Welcome extends PureComponent {
  render() {
    return (
      <Button type="primary"><Icon type="setting" />Test</Button>
    );
  }
}
