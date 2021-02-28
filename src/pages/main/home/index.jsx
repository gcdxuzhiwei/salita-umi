import React from 'react';
import { NoticeBar } from 'antd-mobile';
import { GithubOutlined } from '@ant-design/icons';

function Home() {
  return (
    <NoticeBar marqueeProps={{ loop: true }}>
      沪ICP备20006702号-1 毕设项目，非真实业务!!!
      <a href="https://github.com/gcdxuzhiwei" target="_blank">
        源码点击跳转github
        <GithubOutlined />
      </a>
      后台admin路由为/admin
    </NoticeBar>
  );
}

export default Home;
