import React, { useEffect } from 'react';
import { history } from 'umi';

let Timeout;

function Umi() {
  useEffect(() => {
    Timeout = setTimeout(() => {
      history.push('/main/home');
    }, 2000);
    return () => {
      window.clearTimeout(Timeout);
    };
  }, []);

  return <div>hhhh</div>;
}

export default Umi;
