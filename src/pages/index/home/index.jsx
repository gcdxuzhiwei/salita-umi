import React from 'react';
import { Link } from 'umi';
import { Button } from 'antd-mobile';
import { HomeOutlined } from '@ant-design/icons';

function Home() {
  console.log('dfeasf');
  return (
    <div>
      <Button loading={true} activeStyle={false}>
        123
      </Button>
      <i className='iconfont fullscreen-exit'></i>
      <HomeOutlined />
      <Link to="/detail">sad</Link>
      <div>{window.sessionStorage.getItem('qwe') || 12}</div>
    </div>
  );
}

export default Home;
