import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'umi';
import { getUmiCookie } from '@/utils/const';
import styles from './index.less';

const tab = [
  {
    icon: 'icon-zhaokecheng',
    name: '找家教',
    path: '/main/home',
    show: true,
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
    show: true,
  },
  {
    icon: 'icon-wode1',
    name: '我的',
    path: '/main/mine',
    show: true,
  },
];

function Index(props) {
  const [showTeacher, setShowTeacher] = useState(
    window.localStorage.getItem('role') == 2,
  );

  const pathname = useMemo(() => props.location.pathname, [
    props.location.pathname,
  ]);

  useEffect(() => {
    window.addEventListener('changeRole', getRole);

    return () => {
      window.removeEventListener('changeRole', getRole);
    };
  }, []);

  const getRole = e => {
    setShowTeacher(e.role === 2);
  };

  return (
    <div className={styles.page}>
      {props.children}
      <div className={styles.tabs}>
        {tab.map(
          v =>
            (v.show || (showTeacher && getUmiCookie())) && (
              <Link
                to={v.path}
                key={v.path}
                className={pathname === v.path ? styles.active : ''}
              >
                <i className={`iconfont ${v.icon}`}></i>
                {v.name}
              </Link>
            ),
        )}
      </div>
    </div>
  );
}

export default Index;
