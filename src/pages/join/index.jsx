import React, { useEffect, useState } from 'react';
import { Link } from 'umi';
import { Spin } from 'antd';
import { Steps, WhiteSpace, Toast, SegmentedControl } from 'antd-mobile';
import axios from '@/utils/axios';
import styles from './index.less';

const { Step } = Steps;

const steps = [
  {
    title: '未申请',
    description: '下方可直接申请',
  },
  {
    title: '审核中',
    description: '请耐心等待,审核失败将回到未申请状态',
  },
  {
    title: '已入驻',
    description: '可发布课程',
  },
];

function Join() {
  const [state, setState] = useState(-1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getState();
  }, []);

  const getState = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/user/joinState');
      setState(data.state);
      setLoading(false);
    } catch {
      Toast.fail('网络异常', 1);
    }
  };

  return (
    <>
      <Spin spinning={loading}>
        <WhiteSpace />
        <Steps current={state} direction="horizontal" size="small">
          {steps.map((s, i) => (
            <Step
              key={i}
              title={s.title}
              description={state === i ? s.description : ''}
            />
          ))}
        </Steps>
      </Spin>
      {!loading && state === 0 && (
        <div className={styles.field}>
          <div className={styles.role}>
            教员身份:
            <SegmentedControl values={['在校学生', '在职教师']} />
          </div>
        </div>
      )}
      {!loading && state !== 0 && (
        <Link className={styles.link} to="/main">
          回到首页
        </Link>
      )}
    </>
  );
}

export default Join;
