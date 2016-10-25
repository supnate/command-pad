import React, { Component, PropTypes } from 'react';
import { Link, hashHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import memobind from 'memobind';
import { Button, Checkbox, Col, Form, Icon, Input, message, Popover, Row, Tooltip } from 'antd';
import * as actions from './redux/actions';

const FormItem = Form.Item;

export class CmdEditPage extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    params: PropTypes.object,
    form: PropTypes.object.isRequired,
  };

  getFormItemLabel(name, tooltip) {
    return (
      <span>
        <span>{name}</span>
        <Tooltip title={tooltip}>
          <Icon type="question-circle-o" />
        </Tooltip>
      </span>
    );
  }

  handleSubmit(evt) {
    evt.preventDefault();
    const cmdId = this.props.params.cmdId;
    this.props.form.validateFields((errors, values) => {
      if (errors) {
        return;
      }
      this.props.actions.saveCmd(values, cmdId).then(() => {
        message.success(`${cmdId ? 'Edit' : 'Add'} success.`);
        hashHistory.push('/');
      });
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const cmdId = this.props.params.cmdId;
    const initialData = cmdId ? this.props.home.cmdById[cmdId] : {};

    return (
      <div className="rekit-page home-cmd-edit-page">
        <div className="header">
          <Link to="/"><Icon type="arrow-left" /></Link>
          <h1>{cmdId ? 'Edit' : 'Add'} Command</h1>
        </div>
        <div className="page-content">
          <Form vertical required style={{ margin: 15 }} onSubmit={memobind(this, 'handleSubmit')}>
            <FormItem label="Name">
              {getFieldDecorator('name', {
                initialValue: initialData.name || '',
                rules: [
                  { required: true, whitespace: true, message: 'Name is required.' }
                ],
              })(
                <Input size="default" />
              )}
            </FormItem>
            <FormItem label={this.getFormItemLabel('Command', 'The command to run, e.g., "npm start"')}>
              {getFieldDecorator('cmd', {
                initialValue: initialData.cmd || '',
                rules: [
                  { required: true, message: 'Command is required.' }
                ],
              })(
                <Input size="default" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('sudo', {
                valuePropName: 'checked',
                initialValue: !!initialData.sudo,
              })(
                <Checkbox>{this.getFormItemLabel('Sudo', 'Whether the command needs administrative privileges.')}</Checkbox>
              )}
            </FormItem>
            <FormItem label={this.getFormItemLabel('Working directory', 'Optional. The working directory to run the command.')}>
              {getFieldDecorator('cwd', {
                initialValue: initialData.cwd || '',
              })(
                <Input size="default" />
              )}
            </FormItem>
            <FormItem label={this.getFormItemLabel('Url', 'Optional. If provided, there will be a icon to open the link. Usually for dev servers, e.g., "http://localhost:6076".')}>
              {getFieldDecorator('url', {
                initialValue: initialData.url || '',
              })(
                <Input size="default" />
              )}
            </FormItem>
            
            <FormItem>
              {getFieldDecorator('finishPrompt', {
                valuePropName: 'checked',
                initialValue: !!initialData.finishPrompt,
              })(
                <Checkbox>{this.getFormItemLabel('Notification when finished', 'Optional. Whether to show a notification when the is command finished/failed, it\'s useful for long-time commands. It will not notify you if manually stopping it.')}</Checkbox>
              )}
            </FormItem>
            
            <FormItem className="buttons">
              <Button size="default" type="primary" htmlType="submit">Ok</Button>
              <Button size="default" onClick={() => hashHistory.push('/')}>Cancel</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}

CmdEditPage = Form.create()(CmdEditPage);

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
)(CmdEditPage);
