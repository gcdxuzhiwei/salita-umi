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
        <Link to="/index/home"></Link>
        <Link to="/index/mine">Users Page</Link>
      </div>
    </div>
  );
}

export default Index;
