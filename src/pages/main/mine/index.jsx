import React, { useEffect, useRef } from 'react';
import { Link } from 'umi';
import axios from '@/utils/axios';
import { getUmiCookie } from '@/utils/const';
import styles from './index.less';

function Mine() {
  const login = useRef(!!getUmiCookie());

  useEffect(() => {
    if (login.current) {
      getInfo();
    }
  }, [login.current]);

  const getInfo = async () => {
    const { data } = await axios.post('/api/user/info');
  };

  return (
    <>
      {!login.current ? (
        <Link to="/login" className={styles.login}>
          登录/注册
        </Link>
      ) : (
        <>
          <img src="/public/defaultAvatar.png" alt="" />
        </>
      )}
    </>
  );
}

export default Mine;
