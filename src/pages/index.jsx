import React, { useState, useEffect } from 'react';
import { history } from 'umi';
import { logo } from '../utils/const';
import styles from './index.less';

let timeInterval;
let timeOut;

function Umi() {
  const [time, setTime] = useState(2);
  useEffect(() => {
    timeInterval = setInterval(() => {
      setTime(v => v - 1);
    }, 1000);
    return () => {
      window.clearInterval(timeInterval);
    };
  }, []);

  useEffect(() => {
    if (time === 0) {
      timeOut = setTimeout(() => {
        handleClick();
      }, 400);
      return () => {
        window.clearTimeout(timeOut);
      };
    }
  }, [time]);

  const handleClick = () => {
    history.push('/main/home');
  };

  return (
    <>
      <div className={styles.tip} onClick={handleClick}>
        跳过 {time}
      </div>
      <img className={styles.logo} src={logo} />
      <div className={styles.name}>
        <span>家教服务平台</span>
      </div>
      <div className={styles.power}>powered by xuzhiwei</div>
    </>
  );
}

export default Umi;
