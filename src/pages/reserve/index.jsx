import React, { useEffect, useState } from 'react';
import { Spin, List } from 'antd';
import { Toast } from 'antd-mobile';
import axios from '@/utils/axios';
import styles from './index.less';

function Reserve() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/user/getReserve');
      if (data.err) {
        Toast.fail(data.err);
      } else {
        setLoading(false);
        setData(data.arr);
        if (!data.arr.length) {
          Toast.success('无预约记录');
        }
      }
    } catch {
      Toast.fail('网络异常');
    }
  };

  return (
    <Spin spinning={loading}>
      <List style={{ minHeight: '100vh' }} header="我的预约">
        {data.map(v => (
          <List.Item key={v.time + v.teacher}>
            <div className={styles.item}>
              <img src={'/public/' + v.info.avatar} />
              <div>
                <div>
                  <div>{v.info.name}</div>
                  <div>{v.remark}</div>
                </div>
              </div>
              <span>
                {v.status === 1
                  ? '预约成功'
                  : v.status === 0
                  ? '预约中'
                  : '预约失败'}
              </span>
            </div>
          </List.Item>
        ))}
      </List>
    </Spin>
  );
}

export default Reserve;
