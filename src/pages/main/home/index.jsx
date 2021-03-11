import React, { useEffect, useState } from 'react';
import { NoticeBar } from 'antd-mobile';
import { GithubOutlined } from '@ant-design/icons';
import styles from './index.less';

function Home() {
  const [showTip, setShowTip] = useState(false);

  useEffect(() => {
    const arr = window.location.hostname.split('.');
    if (arr[arr.length - 1] === 'link') {
      setShowTip(true);
    }
  }, []);

  return (
    <>
      {showTip && (
        <NoticeBar marqueeProps={{ loop: true }}>
          沪ICP备20006702号-2 毕设项目，非真实业务!!!
          <a href="https://github.com/gcdxuzhiwei" target="_blank">
            源码点击跳转github
            <GithubOutlined />
          </a>
          后台admin端口为66
        </NoticeBar>
      )}
      <div style={{ top: showTip ? 36 : 0 }} className={styles.main}></div>
    </>
  );
}

export default Home;
