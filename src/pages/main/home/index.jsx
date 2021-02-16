import React from 'react';
import { Link, history } from 'umi';
import { Button } from 'antd-mobile';
import { HomeOutlined } from '@ant-design/icons';

function Home() {
  return (
    <div>
      <Button
        loading={true}
        activeStyle={false}
        onClick={() => history.push('/login')}
      >
        点击注册
      </Button>
      <HomeOutlined />
      <Link to="/detail">sad</Link>
      <div>{window.sessionStorage.getItem('qwe') || 12}</div>
    </div>
  );
}

export default Home;
