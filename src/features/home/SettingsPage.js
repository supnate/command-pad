import React, { Component, PropTypes } from 'react';
import { hashHistory, Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Form, Icon, Input, InputNumber, message, Tooltip } from 'antd';
import * as actions from './redux/actions';

const FormItem = Form.Item;

export class SettingsPage extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

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
    this.props.actions.saveSettings(this.props.form.getFieldsValue()).then(() => {
      message.success('Setting success.');
      hashHistory.push('/');
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="rekit-page home-settings-page">
        <div className="header">
          <Link to="/"><Icon type="arrow-left" /></Link>
          <h1>Settings</h1>
        </div>
        <div className="page-content">
          <Form vertical required style={{ margin: 15 }} onSubmit={this.handleSubmit}>
            <FormItem label={this.getFormItemLabel('Max output rows', 'The max number of output rows.')}>
              {getFieldDecorator('outputRowsLimit', {
                initialValue: this.props.home.outputRowsLimit || 100,
              })(
                <InputNumber size="default" style={{ width: '100%' }} />
              )}
            </FormItem>
            <FormItem label={this.getFormItemLabel('Environment path', 'The environment path to find the command. You may need to set this when using nvm. i.e. /path/to/.nvm/versions/node/bin')}>
              {getFieldDecorator('envPath', {
                initialValue: this.props.home.envPath || '',
              })(
                <Input size="default" />
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

SettingsPage = Form.create()(SettingsPage);

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
)(SettingsPage);
