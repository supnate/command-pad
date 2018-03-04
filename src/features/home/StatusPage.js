import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Col, Form, Icon, Input, Modal, Popover, Row } from 'antd';
import { Link } from 'react-router';
import CmdList from './CmdList';
import { runCmd, stopCmd, deleteCmd, reorderCmds, clearOutput, selectCmd } from './redux/actions';
import { ConsoleOutput, Welcome, BatchAddCmds, ColResizer } from './';

export class StatusPage extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleBeginEdit = this.handleBeginEdit.bind(this);
    this.handleEndEdit = this.handleEndEdit.bind(this);
    this.showImportDialog = () => this.setState({ importDialogVisible: true });
    this.hideImportDialog = () => this.setState({ importDialogVisible: false });
  }

  state = {
    importDialogVisible: false,
    editing: false,
    npmScripts: [],
    prjName: '',
    workingDirectory: '',
  };

  importFromPackageJson = () => {
    bridge.remote.dialog.showOpenDialog(
      {
        title: 'Select package.json',
        filters: [{ name: 'package', extensions: ['json'] }],
        properties: ['openFile'],
      },
      fileNames => {
        const file = fileNames[0];
        try {
          const content = bridge.remote.require('fs').readFileSync(fileNames[0], 'utf8');
          const cwd = bridge.remote.require('path').dirname(file);
          const json = JSON.parse(content);
          const prjName = _.flow(_.camelCase, _.upperFirst)(json.name || 'NONAME');
          const npmScripts = Object.keys(json.scripts);
          this.setState({
            npmScripts,
            prjName,
            workingDirectory: cwd,
            importDialogVisible: true,
          });
          // const cmds = _.entries(json.scripts).map(entry => ({
          //   name: `${prjName} ${entry[0]}`,
          //   cmd: `npm run ${entry[0]}`,
          // }));
        } catch (e) {
          alert(`Failed to load: ${file}`); // eslint-disable-line
        }
      }
    );
  };

  handleBeginEdit() {
    this.setState({
      editing: true,
    });
  }

  handleEndEdit() {
    this.setState({
      editing: false,
    });
  }

  renderLoading() {
    return <div className="home-status-page loading" />;
  }

  render() {
    const { home } = this.props;

    const {
      runCmd,
      stopCmd,
      deleteCmd,
      reorderCmds,
      clearOutput,
      selectCmd,
    } = this.props.actions; /* eslint no-shadow: 0 */
    const { editing } = this.state;
    if (!home.appVersion) return this.renderLoading();

    const allCmds = home.cmdIds.map(id => home.cmdById[id]);
    const currentCmd = home.cmdById[this.props.home.selectedCmd];
    const outputs = currentCmd ? currentCmd.outputs : [];
    const colWidth = home.colWidth;
    return (
      <div className="rekit-page home-status-page">
        {this.state.importDialogVisible && (
          <Modal visible width={600} footer={null} title={`Import scripts from ${this.state.prjName}`}>
            <BatchAddCmds
              importedCmds={this.state.npmScripts}
              prjName={this.state.prjName}
              workingDirectory={this.state.workingDirectory}
              onClose={this.hideImportDialog}
            />
          </Modal>
        )}
        <ColResizer />
        <div className="header">
          {!editing && (
            <Link to="/cmd/add">
              <Icon type="plus" title="Add a Command" />
            </Link>
          )}
          {!editing && <Icon type="folder" title="Import from Package.json" onClick={this.importFromPackageJson} />}
          {!editing && (
            <Link to="/about">
              <Icon type="info-circle-o" title="About" />
            </Link>
          )}
          {!editing && (
            <Link to="/settings">
              <Icon type="setting" />
            </Link>
          )}
          {!editing && allCmds.length > 0 && <Icon type="swap" title="Sort" onClick={this.handleBeginEdit} />}
          {editing && (
            <Button type="primary" size="small" onClick={this.handleEndEdit}>
              End Editing
            </Button>
          )}
        </div>
        <Welcome onImportClick={this.importFromPackageJson} />
        {(allCmds.length > 0 || editing) && (
          <div className="page-content" id="status-list-container">
            <div className="cmd-list-container" style={{ width: `${colWidth}px` }}>
              <CmdList
                cmds={allCmds}
                runCmd={runCmd}
                stopCmd={stopCmd}
                deleteCmd={deleteCmd}
                reorderCmds={reorderCmds}
                clearOutput={clearOutput}
                editing={editing}
                selectCmd={selectCmd}
                selectedCmd={this.props.home.selectedCmd}
              />
              {(allCmds.length > 0 || editing) && (
                <div className="footer" style={{ width: `${colWidth}px` }}>
                  Total {allCmds.length} command{allCmds.length > 1 ? 's' : ''},{' '}
                  {allCmds.filter(c => c.status === 'running').length} running.
                </div>
              )}
            </div>
            <div className="output-container" style={{ left: `${colWidth}px` }}>
              <ConsoleOutput lines={outputs} onClear={() => clearOutput(this.props.home.selectedCmd)} />;
            </div>
          </div>
        )}
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
    actions: bindActionCreators({ runCmd, stopCmd, deleteCmd, reorderCmds, clearOutput, selectCmd }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StatusPage);
