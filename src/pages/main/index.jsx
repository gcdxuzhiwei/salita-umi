import React, { useMemo } from 'react';
import { Link } from 'umi';
import styles from './index.less';

const tab = [
  {
    icon: 'icon-zhaokecheng',
    name: '找家教',
    path: '/main/home',
  },
  {
    icon: 'icon-laoshi',
    name: '做家教',
    path: '/main/teacher',
  },
  {
    icon: 'icon-xiaoxi',
    name: '消息',
    path: '/main/message',
  },
  {
    icon: 'icon-wode1',
    name: '我的',
    path: '/main/mine',
  },
];

function Index(props) {
  const pathname = useMemo(() => props.location.pathname, [
    props.location.pathname,
  ]);

  return (
    <div>
      <div>{props.children}</div>
      <div className={styles.tabs}>
        {tab.map(v => (
          <Link
            to={v.path}
            key={v.path}
            className={pathname === v.path ? styles.active : ''}
          >
            <i className={`iconfont ${v.icon}`}></i>
            {v.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Index;
