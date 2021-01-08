import React, { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

function Register() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleClick = async () => {
    try {
      const { data: res } = await axios.post('/api/user/login', {
        phone,
        password,
      });
      if (res.success) {
        message.success('登录成功');
      }
      if (res.err) {
        message.error(res.err);
      }
    } catch {
      message.error('网络异常');
    }
  };

  const handlere = async () => {
    try {
      const { data: res } = await axios.post('/api/user/register', {
        phone,
        password,
      });
      if (res.success) {
        message.success('注册成功');
      }
      if (res.err) {
        message.error(res.err);
      }
    } catch {
      message.error('网络异常');
    }
  };

  return (
    <div>
      <input
        type="text"
        value={phone}
        onChange={e => {
          setPhone(e.target.value);
        }}
      />
      <input
        type="text"
        value={password}
        onChange={e => {
          setPassword(e.target.value);
        }}
      />
      <button onClick={handleClick}>登录</button>
      <button onClick={handlere}>注册</button>
    </div>
  );
}

export default Register;
