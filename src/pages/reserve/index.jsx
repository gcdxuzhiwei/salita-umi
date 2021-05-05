import React, { useEffect, useState } from 'react';
import { Spin, List, Modal, Input } from 'antd';
import { Toast } from 'antd-mobile';
import { history } from 'umi';
import axios from '@/utils/axios';
import styles from './index.less';

function Reserve() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [showModal, setShowModal] = useState(false);

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

  const command = teacher => {
    setShowModal(teacher);
  };

  const handleCommand = async () => {
    if (!inputValue) {
      Toast.fail('请输入内容');
      return;
    }
    try {
      Toast.loading();
      const { data } = await axios.post('/api/user/commandByReserve', {
        teacher: showModal,
        command: inputValue,
      });
      if (data.err) {
        Toast.fail(data.err);
      } else {
        Toast.hide();
        setInputValue('');
        setShowModal(false);
        getData();
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
                {v.status === 1 &&
                  (v.command === 0 ? (
                    <div
                      onClick={() => {
                        command(v.teacher);
                      }}
                    >
                      点击评价
                    </div>
                  ) : (
                    <div>已经评价</div>
                  ))}
                {v.status === 1 && (
                  <div
                    onClick={() => {
                      history.push(`/chat/${v.info.userId}`);
                    }}
                  >
                    售后
                  </div>
                )}
              </span>
            </div>
          </List.Item>
        ))}
      </List>
      <Modal
        visible={showModal}
        closable={false}
        onCancel={() => {
          setShowModal(false);
          setInputValue('');
        }}
        onOk={() => {
          setTimeout(() => {
            handleCommand();
          }, 0);
        }}
      >
        <Input
          placeholder="输入评价内容"
          value={inputValue}
          onChange={e => {
            setInputValue(e.target.value);
          }}
        />
      </Modal>
    </Spin>
  );
}

export default Reserve;
