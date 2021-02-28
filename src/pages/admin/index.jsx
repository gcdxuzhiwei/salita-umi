import React, { useState, useEffect, useCallback } from 'react';
import { getUmiCookie } from '@/utils/const';
import { history } from 'umi';
import axios from 'axios';
import { Modal, InputItem, Button, WhiteSpace, Toast } from 'antd-mobile';
import { Drawer, Spin } from 'antd';
import { MenuUnfoldOutlined } from '@ant-design/icons';
import styles from './index.less';

const menu = [
  {
    key: '/admin/home',
    name: '主面板',
  },
  {
    key: '/admin/list',
    name: '成员管理',
    auth: true,
  },
];

function Admin(props) {
  const [login, setLogin] = useState(getUmiCookie('adminId'));
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(1);
  const [name, setName] = useState('');
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [showDrawer, setShowDrawer] = useState(false);

  useEffect(() => {
    if (login) {
      getRole();
    }
  }, []);

  const getRole = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/admin/getRole');
      setRole(data.role);
      setName(data.name);
      setLoading(false);
    } catch {
      Toast.fail('网络异常');
    }
  };

  const handleLogin = async () => {
    if (!user || !password) {
      Toast.fail('请输入账号和密码');
      return;
    }
    try {
      const { data } = await axios.post('/api/admin/login', {
        user,
        password,
      });
      if (data.success) {
        setLogin(true);
        Toast.success('登录成功');
      } else {
        Toast.fail(data.err);
      }
    } catch {
      Toast.fail('网络异常');
    }
  };

  return login ? (
    <>
      <Spin spinning={loading}>
        <div className={styles.header}>
          <div
            className={styles.icon}
            onClick={() => {
              setShowDrawer(v => !v);
            }}
          >
            <MenuUnfoldOutlined />
          </div>
          <span>
            {!loading && (
              <>
                {role === 2 ? '超级' : '普通'}管理员:{name}
              </>
            )}
          </span>
        </div>
      </Spin>
      <Drawer
        visible={showDrawer}
        getContainer={() => {
          return document.getElementById('adminDom');
        }}
        width={125}
        closable={false}
        placement="left"
        onClose={() => {
          setShowDrawer(false);
        }}
      >
        {menu.map(
          v =>
            (!v.auth || role === 2) && (
              <div
                className={
                  props.location.pathname === v.key ? styles.nav : '123'
                }
                key={v.key}
                onClick={() => {
                  if (v.key === props.location.pathname) {
                    return;
                  }
                  history.push(v.key);
                  setShowDrawer(false);
                }}
              >
                {v.name}
              </div>
            ),
        )}
      </Drawer>
      <div id="adminDom" className={styles.page}>
        {props.children}
      </div>
    </>
  ) : (
    <Modal visible transparent title="管理员登录">
      无账号可联系超级管理员开号
      <InputItem
        clear
        value={user}
        placeholder="请输入账号"
        onChange={e => setUser(e)}
      >
        账号
      </InputItem>
      <InputItem
        type="password"
        clear
        value={password}
        placeholder="请输入密码"
        onChange={e => setPassword(e)}
      >
        密码
      </InputItem>
      <WhiteSpace />
      <Button onClick={handleLogin}>登录</Button>
    </Modal>
  );
}

export default Admin;
