import React, { useEffect } from 'react';
import { Link } from 'umi';
import styles from './index.less';

let Interval;

function Index(props) {
  useEffect(() => {
    Interval = setInterval(() => {
      console.log(222);
    }, 500);
    return () => {
      window.clearInterval(Interval);
    };
  }, []);
  console.log(props);

  return (
    <div>
      <div>{props.children}</div>
      <div className={styles.tabs}>
        <Link to="/main/home">
          <i className="iconfont icon-zhaokecheng"></i>找家教
        </Link>
        <Link to="/main/teacher">
          <i className="iconfont icon-laoshi"></i>做家教
        </Link>
        <Link to="/main/message">
          <i className="iconfont icon-xiaoxi"></i>消息
        </Link>
        <Link to="/main/mine">
          <i className="iconfont icon-wode"></i>我的
        </Link>
      </div>
    </div>
  );
}

export default Index;
