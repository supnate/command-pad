import React, { PureComponent } from 'react';
import { Button, Icon, Tooltip, Popover} from 'antd';

export default class Welcome extends PureComponent {
  render() {
    const content = (
      <div>
        <p>export default class Welcome extends PureComponen</p>
      </div>
    );
    return (
      <div>
        <Tooltip title="export default class Welcome extends PureComponen">
          <Button type="primary"><Icon type="setting" />Test</Button>
        </Tooltip>
        <br />
        <Popover content={content} title="Title" trigger="click">
          <Button type="primary"><Icon type="setting" />Test</Button>
        </Popover>
      </div>
    );
  }
}
