import React, { useState, useEffect } from 'react';
import { history } from 'umi';
import '../../utils/jigsaw.min.js';
import { logo } from '../../utils/const';
import styles from './index.less';
import axios from '../../utils/axios';
import { Tabs, InputItem, Button, Modal, Toast, Checkbox } from 'antd-mobile';

const tabs = [{ title: '登录' }, { title: '注册' }];

function Login() {
  const [page, setPage] = useState(0);
  // 登录
  const [leftPhone, setLeftPhone] = useState('');
  const [leftPassword, setLeftPassword] = useState('');
  const [leftCheck, setLeftCheck] = useState(false);
  // 注册
  const [rightPhone, setRightPhone] = useState('');
  const [rightPassword1, setRightPassword1] = useState('');
  const [rightPassword2, setRightPassword2] = useState('');
  const [rightAble, setRightAble] = useState(false);
  const [rightModal, setRightModal] = useState(false);

  useEffect(() => {
    if (rightModal) {
      jigsaw.init({
        el: document.getElementById('jigsaw'),
        width: 240, // 可选, 默认310
        height: 155, // 可选, 默认155
        onSuccess: function() {
          Toast.success('验证成功', 1);
          setRightModal(false);
          setRightAble(true);
        },
        onFail: function() {
          Toast.fail('验证失败，请再次尝试', 1);
        },
      });
    }
  }, [rightModal]);

  const handleLeft = async () => {
    if (!verifyPhone(leftPhone) || !verifyPassword(leftPassword)) {
      Toast.fail('请输入正确的手机号和密码', 1);
    } else {
      try {
        Toast.loading('登录中', 60);
        const { data } = await axios.post('/api/user/login', {
          phone: formatPhone(leftPhone),
          password: leftPassword,
          save: leftCheck,
        });
        if (data.success) {
          Toast.loading('登录成功，1秒后跳转', 1);
          const clear = setTimeout(() => {
            if (history.length <= 2) {
              history.push('/');
            } else {
              history.goBack();
            }
            clearTimeout(clear);
          }, 900);
        } else {
          Toast.fail(data.err, 1);
        }
      } catch {
        Toast.fail('网络异常', 1);
      }
    }
  };

  const handleRight = async () => {
    if (!rightAble) {
      setRightModal(true);
    } else {
      if (rightPassword1 !== rightPassword2) {
        Toast.fail('两次密码不同', 1);
        return;
      }
      if (!verifyPhone(rightPhone)) {
        Toast.fail('请输入正确的手机号', 1);
        return;
      }
      if (!verifyPassword(rightPassword1)) {
        Toast.fail(
          '密码必须同时具有字母和数字，长度为6-16位，不能包含其他字符',
          2,
        );
        return;
      }
      Toast.loading('注册中', 60);
      try {
        const { data } = await axios.post('/api/user/register', {
          phone: formatPhone(rightPhone),
          password: rightPassword1,
        });
        if (data.success) {
          Toast.success('注册成功', 1);
          setRightPhone('');
          setRightPassword1('');
          setRightPassword2('');
          setPage(0);
        } else {
          Toast.fail(data.err, 1);
        }
      } catch {
        Toast.fail('网络异常', 1);
      }
    }
  };

  const verifyPhone = str => {
    return str.length === 13 && str[0] === '1';
  };

  const verifyPassword = str => {
    if (str.length < 6 || str.length > 16) {
      return false;
    }
    const re = new RegExp(/^(?!\d+$)(?![a-zA-Z]+$)[a-zA-Z\d]+$/);
    return re.test(str);
  };

  const formatPhone = str => {
    return str.split(' ').join('');
  };

  return (
    <>
      <div className={styles.logo}>
        <img src={logo} />
      </div>
      <Tabs tabs={tabs} page={page} onChange={(v, i) => setPage(i)}>
        <div className={styles.main}>
          <InputItem
            type="phone"
            clear
            value={leftPhone}
            placeholder="请输入手机号"
            onChange={e => setLeftPhone(e)}
          >
            手机号
          </InputItem>
          <InputItem
            type="password"
            clear
            value={leftPassword}
            placeholder="请输入密码"
            onChange={e => setLeftPassword(e)}
          >
            密码
          </InputItem>
          <div className={styles.check}>
            <Checkbox
              checked={leftCheck}
              onChange={() => setLeftCheck(v => !v)}
            >
              七天内自动登录
            </Checkbox>
          </div>
          <Button className={styles.button} type="primary" onClick={handleLeft}>
            登录
          </Button>
        </div>
        <div className={styles.main}>
          <InputItem
            type="phone"
            clear
            value={rightPhone}
            placeholder="请输入手机号"
            onChange={e => setRightPhone(e)}
          >
            手机号
          </InputItem>
          <InputItem
            type="password"
            clear
            value={rightPassword1}
            placeholder="请输入密码"
            onChange={e => setRightPassword1(e)}
          >
            密码
          </InputItem>
          <InputItem
            type="password"
            clear
            value={rightPassword2}
            placeholder="请输入密码"
            onChange={e => setRightPassword2(e)}
          >
            确认密码
          </InputItem>
          <Button
            className={styles.button}
            type="primary"
            onClick={handleRight}
          >
            {rightAble ? '注册' : '点击验证'}
          </Button>
        </div>
      </Tabs>
      <Modal
        visible={rightModal}
        transparent
        maskClosable
        onClose={() => setRightModal(false)}
      >
        <div id="jigsaw"></div>
      </Modal>
    </>
  );
}

export default Login;
