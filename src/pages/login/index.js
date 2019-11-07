/**
 * title: 欢迎登录-中铁建BI决策分析系统
 */
import React, {PureComponent, Fragment} from 'react';
/**
 * Fragment: 将一些子元素添加到 DOM tree 上且不需要为这些元素提供额外的父节点
 * */
import PropTypes from 'prop-types';
import {connect} from 'dva';
import {Button, Modal, Form, Input, message, Icon} from 'antd';
import styles from './index.less';
import logo from '@/assets/logo.png';
import Mobility1 from '@/assets/Mobility-1.png';
import Mobility2 from '@/assets/Mobility2.png';
import MediaQuery from 'react-responsive';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

@Form.create({name: 'EditModal'})
class EditModal extends PureComponent {

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('NewPassword')) {
      callback('您输入的两个密码不一致!');
    } else {
      callback();
    }
  };

  editPassword = e => {
    e.preventDefault();
    const { dispatch, form, handleCancel } = this.props;
    const { validateFields } = form;
    validateFields((errors, values) => {
      if (errors) {
        return
      }
      const { Confirm, ...other   } = values;
      dispatch({type: 'login/editPassWord', payload: other}).then(_ => {
        if(_){
          message.success("密码修改成功！")
          handleCancel()
        }
      })
    })
  }

  render() {
    const { visible, handleCancel, form, loading } = this.props
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="修改密码"
        className={styles['modal-warp']}
        maskClosable={false}
        destroyOnClose={true}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading.effects["login/editPassWord"]}
            onClick={this.editPassword}
          >
            {
              loading.effects["login/editPassWord"] ? '提交中...' : '提交'
            }
          </Button>,
        ]}
      >
        <Form {...formItemLayout} onSubmit={this.editPassword}>
          <Form.Item label="用户名">
            {getFieldDecorator('Code', {
              rules: [
                {
                  required: true,
                  message: '请输入用户名!',
                },
              ],
            })(<Input placeholder="请输入用户名"/>)}
          </Form.Item>
          <Form.Item label="原密码">
            {getFieldDecorator('OldPassword', {
              rules: [
                {
                  required: true,
                  message: '请输入原密码!',
                },
              ],
            })(<Input.Password placeholder="请输入原密码"/>)}
          </Form.Item>
          <Form.Item label="新密码">
            {getFieldDecorator('NewPassword', {
              rules: [
                {
                  required: true,
                  message: '请输入新密码!',
                },
                {
                  min: 6,
                  message: '密码不能少于6个字符',
                },
              ],
            })(<Input.Password placeholder="请输入新密码"/>)}
          </Form.Item>
          <Form.Item label="确认密码">
            {getFieldDecorator('Confirm', {
              rules: [
                {
                  required: true,
                  message: '请再次输入新密码!',
                },
                {
                  validator: this.compareToFirstPassword,
                },
              ],
            })(<Input.Password placeholder="请再次输入新密码" />)}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

@connect(({loading, login}) => ({loading, login}))
@Form.create({name: 'login'})
class Login extends PureComponent {

  state = {
    modalLoading: false,
    visible: false,
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { validateFields } = form;
    validateFields((errors, values) => {
      if (errors) {
        return
      }
      dispatch({type: 'login/login', payload: values})
    })
  };



  render() {
    const { loading, form, dispatch } = this.props;
    const isLoading = loading.effects['login/login'];
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = form;
    const { visible, modalLoading } = this.state;

    const CodeError = isFieldTouched('Code') && getFieldError('Code');
    const PasswordError = isFieldTouched('Password') && getFieldError('Password');

    const editProps = {
      visible,
      dispatch,
      loading,
      handleCancel: this.handleCancel
    }
    return (
      <Fragment>
        <MediaQuery minDeviceWidth={1224}>
          {/*pc端*/}
          <div className={styles.login_warp}>
            <i className={styles.login_warp_hole_img} />
            <div className={styles.login_form_inner}>
              <div className={styles.login_form_img}>
                <img src={Mobility1} alt=""/>
                <img className={styles.breathingLampImage} src={Mobility2} alt=""/>
              </div>
              <div className={styles.form}>
                <div className={styles.logo}>
                  <img alt="logo" src={logo} />
                  <h3>中铁建商业BI决策分析系统</h3>
                </div>
                <Form onSubmit={this.handleSubmit} hideRequiredMark>
                  <FormItem hasFeedback>
                    {getFieldDecorator('Code', {
                      rules: [
                        {
                          required: true,
                          message: '用户编码不能为空'
                        },
                      ],
                    })(
                      <Input
                        onPressEnter={this.handleSubmit}
                        size='large'
                        placeholder='请输入用户编码'
                      />
                    )}
                  </FormItem>
                  <FormItem hasFeedback>
                    {getFieldDecorator('Password', {
                      rules: [
                        {
                          required: true,
                          message: '密码不能为空'
                        },
                      ],
                    })(
                      <Input
                        type="password"
                        onPressEnter={this.handleSubmit}
                        size='large'
                        placeholder='请输入密码'
                      />
                    )}
                  </FormItem>
                  <Form.Item>
                    <div className={styles['extra-list']}>
                      <a className={styles['edit-password']} href="javascript:void(0)" onClick={this.showModal}>更改密码</a>
                    </div>
                    <Button type="primary" size='large' htmlType="submit" loading={isLoading} >
                      {isLoading ? '登录中...' : '登录'}
                    </Button>
                  </Form.Item>
                </Form>
                <EditModal {...editProps}/>
              </div>
            </div>
          </div>
        </MediaQuery>
        <MediaQuery maxDeviceWidth={1224}>
          <div className={styles['mobile-form']}>
            <div className={styles.logo}>
              <img alt="logo" src={logo} />
              <h3>中铁建商业BI决策分析系统</h3>
            </div>
            <Form onSubmit={this.handleSubmit} hideRequiredMark>
              <FormItem hasFeedback>
                {getFieldDecorator('Code', {
                  rules: [
                    {
                      required: true,
                      message: '用户编码不能为空'
                    },
                  ],
                })(
                  <Input
                    onPressEnter={this.handleSubmit}
                    size='large'
                    placeholder='请输入用户编码'
                  />
                )}
              </FormItem>
              <FormItem hasFeedback>
                {getFieldDecorator('Password', {
                  rules: [
                    {
                      required: true,
                      message: '密码不能为空'
                    },
                  ],
                })(
                  <Input
                    type="password"
                    onPressEnter={this.handleSubmit}
                    size='large'
                    placeholder='请输入密码'
                  />
                )}
              </FormItem>
              <Form.Item>
                <div className={styles['extra-list']}>
                  <a className={styles['edit-password']} href="javascript:void(0)" onClick={this.showModal}>更改密码</a>
                </div>
                <Button type="primary" size='large' htmlType="submit" loading={isLoading} >
                  {isLoading ? '登录中...' : '登录'}
                </Button>
              </Form.Item>
            </Form>
            <EditModal {...editProps}/>
          </div>
        </MediaQuery>
      </Fragment>
    )
  }
}

Login.propTypes = {
  form: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default Login
