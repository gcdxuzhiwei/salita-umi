import React, { useEffect } from 'react';
import { history } from 'umi';

let Timeout;

function Umi() {
  useEffect(() => {
    Timeout = setTimeout(() => {
      history.push('/index/home');
    }, 2000);
    return () => {
      window.clearTimeout(Timeout);
    };
  }, []);

  return <div>hhh</div>;
}

export default Umi;
