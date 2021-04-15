import React, { useEffect, useState } from 'react';
import { Checkbox, Spin, Button, Modal } from 'antd';
import { Toast, TextareaItem } from 'antd-mobile';
import axios from '@/utils/axios';
import styles from './index.less';

function Teacher() {
  const [loading, setLoading] = useState(true);
  const [group1, setGroup1] = useState('');
  const [group2, setGroup2] = useState('');
  const [visible, setVisible] = useState(0);
  const [introduce, setIntroduce] = useState('');
  const [canPub, setCanPub] = useState(true);
  const [list, setList] = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  useEffect(() => {
    getInfo();
    getList();
  }, []);

  const getInfo = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/user/teacherInfo');
      const { res } = data;
      setGroup1(res.group1);
      setGroup2(res.group2);
      setVisible(res.visible);
      setIntroduce(res.introduce);
      setLoading(false);
    } catch {
      Toast.fail('网络异常');
    }
  };

  const getList = async () => {
    try {
      setLoadingList(true);
      const { data } = await axios.post('/api/user/teacherReserveList');
      if (data.err) {
        Toast.fail(data.err);
        return;
      }
      setList(data.arr);
      setLoadingList(false);
    } catch {
      Toast.fail('网络异常');
    }
  };

  const handleChange = async () => {
    if (!group1 || !group2 || !introduce) {
      Toast.fail('请先完善信息');
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.post('/api/user/teacherInfoChange', {
        visible,
        group1,
        group2,
        introduce,
      });
      if (data.success) {
        Toast.success('修改成功');
        setCanPub(true);
        setLoading(false);
      } else {
        Toast.fail(data.err);
      }
    } catch {
      Toast.fail('网络异常');
    }
  };

  const handlePub = async () => {
    if (!group1 || !group2 || !introduce) {
      Toast.fail('请先完善信息');
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.post('/api/user/teacherChangeVisible', {
        visible: 1,
      });
      if (data.success) {
        setVisible(true);
        setLoading(false);
        Toast.success('发布成功');
      } else {
        Toast.fail(data.err);
      }
    } catch {
      Toast.fail('网络异常');
    }
  };

  const handleUnPub = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/user/teacherChangeVisible', {
        visible: 0,
      });
      if (data.success) {
        setVisible(false);
        setLoading(false);
        Toast.success('取消发布成功');
      } else {
        Toast.fail(data.err);
      }
    } catch {
      Toast.fail('网络异常');
    }
  };

  const clickReserve = (student, status, name) => {
    Modal.confirm({
      title: `确定要 ${status === 1 ? '接受' : '拒绝'} ${name}的预约吗`,
      onOk: () => {
        setTimeout(() => {
          clickReserveOk(student, status);
        }, 0);
      },
    });
  };

  const clickReserveOk = async (student, status) => {
    Toast.loading();
    try {
      const { data } = await axios.post('/api/user/teacherChangeReserve', {
        student,
        status,
      });
      if (data.err) {
        Toast.fail(data.err);
      } else {
        Toast.success('修改成功');
        getList();
      }
    } catch {
      Toast.fail('网络异常');
    }
  };

  return (
    <>
      <Spin spinning={loading}>
        <div className={styles.group}>
          可教年级:
          <Checkbox.Group
            value={group1.split('')}
            onChange={g => {
              setCanPub(false);
              setGroup1(g.join(''));
            }}
            options={[
              { label: '小学', value: '小' },
              { label: '初中', value: '初' },
              { label: '高中', value: '高' },
            ]}
          />
        </div>
        <div className={styles.group}>
          可教科目:
          <Checkbox.Group
            value={group2.split('')}
            onChange={g => {
              setCanPub(false);
              setGroup2(g.join(''));
            }}
            options={[
              { label: '语文', value: '语' },
              { label: '数学', value: '数' },
              { label: '英语', value: '英' },
              { label: '物理', value: '物' },
              { label: '化学', value: '化' },
              { label: '生物', value: '生' },
              { label: '地理', value: '地' },
              { label: '政治', value: '政' },
              { label: '历史', value: '历' },
            ]}
          />
        </div>
        <div className={styles.group}>
          自我介绍:
          <TextareaItem
            rows={4}
            count={600}
            value={introduce}
            onChange={value => {
              setCanPub(false);
              setIntroduce(value);
            }}
          />
        </div>
        <div className={styles.group}>
          <Button onClick={handleChange}>点击提交修改信息</Button>
        </div>
        <div className={styles.group}>
          发布状态: {visible ? '已发布' : '未发布'}
          {!visible ? (
            <Button onClick={handlePub} disabled={!canPub} type="primary">
              {canPub ? '点击发布' : '点击发布(请先提交修改)'}
            </Button>
          ) : (
            <Button onClick={handleUnPub} type="danger">
              取消发布
            </Button>
          )}
        </div>
      </Spin>
      <Spin spinning={loadingList}>
        <div className={styles.list}>
          {list.map(v => (
            <div className={styles.item} key={v.time}>
              <div className={styles.left}>
                <div>
                  {v.info.name} {v.info.sex === 0 ? '男' : '女'} {v.info.age}
                </div>
                <div>
                  {v.info.area} {v.info.phone}
                </div>
                <div>{v.remark}</div>
              </div>
              <div className={styles.right}>
                {v.status === 0 ? (
                  <>
                    <Button
                      type="primary"
                      onClick={() => {
                        clickReserve(v.student, 1, v.info.name);
                      }}
                    >
                      接受
                    </Button>
                    <Button
                      type="danger"
                      onClick={() => {
                        clickReserve(v.student, -1, v.info.name);
                      }}
                    >
                      拒绝
                    </Button>
                  </>
                ) : (
                  <Button disabled>已{v.status === 1 ? '接受' : '拒绝'}</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Spin>
    </>
  );
}

export default Teacher;
