import React from 'react';
import { FrownTwoTone } from '@ant-design/icons';
import styles from './index.less';

function Wrong() {
  return (
    <div className={styles.page}>
      <FrownTwoTone />
      页面不存在
    </div>
  );
}

export default Wrong;
