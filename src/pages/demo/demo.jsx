import React, { useEffect } from 'react';
import '../../utils/jigsaw.min.js';
import styles from './demo.less';

function Demo() {
  useEffect(() => {
    jigsaw.init({
      el: document.getElementById('container'),
      width: 310, // 可选, 默认310
      height: 155, // 可选, 默认155
      onSuccess: function() {
        console.log(123);
      },
      onFail: function() {
        console.log(456);
      },
      onRefresh: function() {
        console.log(666);
      },
    });
  }, []);

  return (
    <>
      <div>123</div>
      <div id="container" className={styles.container}></div>
      <div>123</div>
    </>
  );
}

export default Demo;
