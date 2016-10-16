import React, { PureComponent, PropTypes } from 'react';
import _ from 'lodash';
import memobind from 'memobind';
import CmdListItem from './CmdListItem';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

class CmdList extends PureComponent {
  static propTypes = {
    cmds: PropTypes.array.isRequired,
    editing: PropTypes.bool,
    runCmd: PropTypes.func.isRequired,
    stopCmd: PropTypes.func.isRequired,
    deleteCmd: PropTypes.func.isRequired,
    reorderCmds: PropTypes.func.isRequired,
  };

  static defaultProps = {
    cmds: [],
  };

  constructor(props) {
    super(props);
    this.moveCmdItem = this.moveCmdItem.bind(this);
    this.dropCmdItem = this.dropCmdItem.bind(this);
  }

  state = {
    movingCmdIds: null,
  };

  moveCmdItem(sourceIndex, targetIndex) {
    let movingCmdIds = this.state.movingCmdIds;
    if (!movingCmdIds) {
      movingCmdIds = _.map(this.props.cmds, 'id');
    }
    const arr = [...movingCmdIds];
    const sourceItem = _.pullAt(arr, sourceIndex)[0];
    arr.splice(targetIndex, 0, sourceItem);
    this.setState({
      movingCmdIds: arr,
    });
  }

  dropCmdItem() {
    this.props.reorderCmds(this.state.movingCmdIds);
    this.setState({
      movingCmdIds: null,
    });
  }

  render() {
    let cmds = this.props.cmds;
    if (this.state.movingCmdIds) {
      const groups = _.groupBy(cmds, 'id');
      cmds = this.state.movingCmdIds.map(id => groups[id][0]);
    }
    return (
      <ul className="home-cmd-list">
        {
          cmds.map((item, index) =>
            <CmdListItem
              key={item.id}
              index={index}
              cmd={item}
              editing={this.props.editing}
              runCmd={this.props.runCmd}
              stopCmd={this.props.stopCmd}
              deleteCmd={this.props.deleteCmd}
              moveCmdItem={this.moveCmdItem}
              dropCmdItem={this.dropCmdItem}
            />
          )
        }
      </ul>
    );
  }
}

export default _.flow(
  DragDropContext(HTML5Backend),
)(CmdList);

