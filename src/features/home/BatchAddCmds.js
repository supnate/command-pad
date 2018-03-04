import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Button, Checkbox, Radio, Input, Row, Col, message } from 'antd';
import * as actions from './redux/actions';

export class BatchAddCmds extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    importedCmds: PropTypes.array.isRequired,
    prjName: PropTypes.string.isRequired,
    workingDirectory: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state.cmds = this.getCmds(props);
    this.state.selectedCmds = props.importedCmds;
  }

  state = { selectedCmds: [], runner: 'npm', cmds: [] };

  componentWillReceiveProps(nextProps) {
    this.setState({
      cmds: this.getCmds(nextProps),
      selectedCmds: nextProps.importedCmds,
    });
  }
  getCmds(props) {
    return props.importedCmds.map(cmd => ({
      id: cmd,
      name: `${props.prjName} ${cmd}`,
      command: `npm run ${cmd}`,
    }));
  }
  haneleRunnerChange = evt => {
    const runner = evt.target.value;
    const newCmds = this.state.cmds.map(cmd => ({
      ...cmd,
      command: cmd.command.replace(/^npm |^yarn /, `${runner} `),
    }));
    this.setState({ cmds: newCmds, runner });
  };

  handleDone = () => {
    this.state.cmds
      .filter(cmd => _.includes(this.state.selectedCmds, cmd.id))
      .map(cmd => () =>
        this.props.actions.saveCmd({
          name: cmd.name,
          cmd: cmd.command,
          cwd: this.props.workingDirectory,
        })
      )
      .reduce((promise, task) => promise.then(() => task()), Promise.resolve())
      .then(() => {
        this.props.onClose();
        message.success('Import commands success.');
      });
  };

  handleSelect = (cmd, selected) => {
    let newSelectedCmds;
    if (selected) {
      newSelectedCmds = _.union([...this.state.selectedCmds, cmd.id]);
    } else {
      newSelectedCmds = _.without(this.state.selectedCmds, cmd.id);
    }
    this.setState({ selectedCmds: newSelectedCmds });
  };
  handleCmdChange = (propName, cmd, evt) => {
    const index = this.state.cmds.indexOf(cmd);
    const cmds = this.state.cmds;
    const newCmds = [
      ...cmds.splice(0, index),
      {
        ...cmd,
        [propName]: evt.target.value,
      },
      ...cmds.splice(index + 1),
    ];
    this.setState({ cmds: newCmds });
  };

  render() {
    const { prjName } = this.props;
    return (
      <div className="home-batch-add-cmds">
        <div>Working directory: {this.props.workingDirectory}</div>
        <div className="home-batch-add-cmds-header" style={{ marginTop: '10px', marginBottom: '10px' }}>
          Using: &nbsp;<Radio.Group value={this.state.runner} onChange={this.haneleRunnerChange}>
            <Radio value="npm">npm</Radio>
            <Radio value="yarn">yarn</Radio>
          </Radio.Group>
        </div>
        <Row gutter={10} style={{ padding: '5px 0' }}>
          <Col span={1} style={{ textAlign: 'center', paddingTop: '5px' }} />
          <Col span={10}>
            <b>Name</b>
          </Col>
          <Col span={13}>
            <b>Command</b>
          </Col>
        </Row>
        <div className="scroll-node">
          {this.state.cmds.map(cmd => (
            <Row gutter={10} style={{ padding: '5px 0' }} key={cmd.name}>
              <Col span={1} style={{ textAlign: 'center', paddingTop: '5px' }}>
                <Checkbox
                  checked={_.includes(this.state.selectedCmds, cmd.id)}
                  onChange={evt => this.handleSelect(cmd, evt.target.checked)}
                />
              </Col>
              <Col span={10}>
                <Input value={cmd.name} onChange={evt => this.handleCmdChange('name', cmd, evt)} />
              </Col>
              <Col span={13}>
                <Input value={cmd.command} onChange={evt => this.handleCmdChange('command', cmd, evt)} />
              </Col>
            </Row>
          ))}
        </div>
        <div className="form-footer">
          <Button type="primary" onClick={this.handleDone}>
            Done
          </Button>
          <Button onClick={this.props.onClose}>Cancel</Button>
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
    actions: bindActionCreators({ ...actions }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BatchAddCmds);
