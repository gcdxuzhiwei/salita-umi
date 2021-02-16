import React, { useRef } from 'react';
import { Link } from 'umi';
import { getUmiCookie } from '@/utils/const';

function Mine() {
  const login = useRef(!!getUmiCookie());

  return (
    <>
      {!login.current ? (
        <Link to="/login">登录/注册</Link>
      ) : (
        <>
          <img src="/public/defaultAvatar.png" alt="" />
        </>
      )}
    </>
  );
}

export default Mine;
