import React, { PureComponent, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { Link } from 'react-router';
import _ from 'lodash';
import { DragSource, DropTarget } from 'react-dnd';
import { Icon, Input, Modal, Popover } from 'antd';
import ALink from './ALink';

function collectDragSource(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

function collectDropTarget(connect) {
  return {
    connectDropTarget: connect.dropTarget(),
  };
}

const cmdItemSource = {
  beginDrag(props) {
    return {
      id: props.cmd.id,
      index: props.index,
    };
  }
};

const cmdItemTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect(); // eslint-disable-line

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    // Time to actually perform the action
    props.moveCmdItem(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex; // eslint-disable-line
  },

  drop(props) {
    props.dropCmdItem(props.index);
  },
};

class CmdListItem extends PureComponent {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired, // eslint-disable-line
    isDragging: PropTypes.bool.isRequired,
    cmd: PropTypes.object.isRequired,
    moveCmdItem: PropTypes.func.isRequired, // eslint-disable-line
    dropCmdItem: PropTypes.func.isRequired, // eslint-disable-line

    editing: PropTypes.bool,
    runCmd: PropTypes.func.isRequired,
    stopCmd: PropTypes.func.isRequired,
    deleteCmd: PropTypes.func.isRequired,
  };

  static defaultProps = {
    editing: false,
  };

  constructor(props) {
    super(props);
    this.handleRunCmd = this.handleRunCmd.bind(this);
    this.handleStopCmd = this.handleStopCmd.bind(this);
    this.handleDeleteCmd = this.handleDeleteCmd.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handlePasswordOk = this.handlePasswordOk.bind(this);
    this.handlePasswordKeyUp = this.handlePasswordKeyUp.bind(this);
    this.handlePasswordInputShow = this.handlePasswordInputShow.bind(this);
    this.hidePasswordDialog = () => this.setState({ isPasswordDialogVisible: false });
  }

  state = {
    isPasswordDialogVisible: false,
    password: null,
  };

  getTooltipContainer() {
    return document.getElementById('status-list-container') || document.body;
  }

  getOutputPopover() {
    const cmd = this.props.cmd;
    if (!cmd.outputs || !cmd.outputs.length) return null;
    return (
      <ul className="output-list">
        {
          cmd.outputs.map(line => <li key={line.id} dangerouslySetInnerHTML={{__html: line.text}}></li>)
        }
      </ul>
    );
  }

  getPortString() {
    const cmd = this.props.cmd;
    if (cmd.url && /:(\d+)/.test(cmd.url)) {
      return ` ${RegExp.$1}`;
    }
    return '';
  }

  handleRunCmd() {
    const cmd = this.props.cmd;
    if (cmd.sudo) {
      this.setState({
        isPasswordDialogVisible: true,
      }, () => {
        this.iptPwd.refs.input.focus();
      });
      return;
    }
    this.props.runCmd(this.props.cmd.id);
  }

  handlePasswordChange(evt) {
    this.setState({
      password: evt.target.value,
    });
  }

  handlePasswordKeyUp(evt) {
    if (evt.key === 'Enter') {
      this.handlePasswordOk();
    }
  }

  handlePasswordInputShow(iptPwd) {
    this.iptPwd = iptPwd;
  }
  handlePasswordOk() {
    this.setState({
      isPasswordDialogVisible: false,
    });
    this.props.runCmd(this.props.cmd.id, this.state.password);
  }

  handleStopCmd() {
    this.props.stopCmd(this.props.cmd.id);
  }

  handleDeleteCmd() {
    const cmd = this.props.cmd;
    if (cmd.status !== 'stopped') {
      Modal.confirm({
        title: 'The command is running',
        content: 'Do you want stop and delete it?',
        okText: 'Ok',
        cancelText: 'Cancel',
        onOk: () => {
          this.props.deleteCmd(cmd.id);
        }
      });
    } else {
      this.props.deleteCmd(cmd.id);
    }
  }

  renderOutput() {
    const cmd = this.props.cmd;
    if (cmd.error) {
      let errMsg;
      if (cmd.error.errno === 'ENOENT') errMsg = 'failed to execute the command.';
      else errMsg = cmd.error.message || cmd.error.toString();
      return (
        <span className="output error">
          Error: {errMsg}
        </span>
      );
    }
    const outputs = cmd.outputs ? cmd.outputs.filter(c => !!c.text) : [];
    if (!outputs.length) return null;
    return (
      <span className="output" dangerouslySetInnerHTML={{__html: _.last(outputs).text}}>
      </span>
    );
  }

  renderActionIcon() {
    const cmd = this.props.cmd;
    switch (cmd.status) {
      case 'running':
      case 'starting':
      case 'stopping':
        return (
          <Icon
            title="Stop"
            type="stop-circle"
            className="action-icon"
            onClick={this.handleStopCmd}
          />
        );
      case 'stopped':
        return (
          <Icon
            title="Start"
            type="play-circle"
            className="action-icon"
            onClick={this.handleRunCmd}
          />
        );
      default:
        return null;
    }
  }

  render() {
    const {
      connectDragSource,
      connectDropTarget,
      isDragging,
      cmd,
      editing
    } = this.props;

    return connectDragSource(connectDropTarget(
      <li className={`home-command-list-item ${cmd.status || 'stopped'}`} style={{ opacity: isDragging ? 0 : 1 }}>
        <Modal
          title="Sudo password:"
          wrapClassName="cmd-pwd-modal"
          visible={this.state.isPasswordDialogVisible}
          onOk={this.handlePasswordOk}
          onCancel={this.hidePasswordDialog}
          okText="Ok"
          cancelText="Cancel"
        >
          <p><Input value={this.state.password} ref={this.handlePasswordInputShow} type="password" onChange={this.handlePasswordChange} onKeyUp={this.handlePasswordKeyUp}/></p>
        </Modal>

        {this.renderActionIcon(cmd)}

        {cmd.url && <ALink className="url-link" url={cmd.url}><Icon type="link" />{this.getPortString(cmd)}</ALink>}
        <Link to={`/cmd/edit/${cmd.id}`} title={cmd.cmd} className="name">{cmd.name || cmd.cmd || 'No name.'}{cmd.sudo && <span className="sudo-icon">S</span>}</Link>
        {!editing && this.renderOutput(cmd)}

        <div className="buttons">
          {editing && <Icon type="delete" title="Delete" onClick={this.handleDeleteCmd} />}
          {editing && <div className="icon-move" title="Move" />}
          {
            !editing && cmd.outputs && cmd.outputs.length > 0 &&
            <Popover
              trigger="hover"
              content={this.getOutputPopover(cmd.id)}
              placement="left"
              getTooltipContainer={this.getTooltipContainer}
              arrowPointAtCenter
            >
              <Icon type="eye-o" />
            </Popover>
          }
        </div>
      </li>
    ));
  }
}

export default _.flow(
  DragSource('CMD_ITEM', cmdItemSource, collectDragSource),
  DropTarget('CMD_ITEM', cmdItemTarget, collectDropTarget),
)(CmdListItem);
