import React, { useEffect, useState } from 'react';
import { Skeleton, Card, Avatar } from 'antd';
import {
  CommentOutlined,
  CarryOutOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { history } from 'umi';
import { Toast, List, TextareaItem, Modal } from 'antd-mobile';
import moment from 'moment';
import axios from '@/utils/axios';
import { getUmiCookie } from '@/utils/const';
import styles from './index.less';

const { Meta } = Card;

function Detail(props) {
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalInput, setModalInput] = useState('');
  const [command, setCommand] = useState([]);

  useEffect(() => {
    getData(...props.history.location.pathname.split('/').slice(-1));
  }, []);

  const getData = async id => {
    try {
      const { data } = await axios.post('/api/user/userDetail', {
        userId: id,
      });
      if (data.retdata) {
        setInfo(data.retdata);
        setCommand(data.retdata.command);
        setLoading(false);
      } else {
        Toast.fail(data.err);
      }
    } catch {
      Toast.fail('网络异常');
    }
  };

  const hanlePost = () => {
    if (!getUmiCookie()) {
      Toast.fail('请先前往我的页面登录');
      return;
    }
    setModalInput('');
    setShowModal(true);
  };

  const pressPost = async () => {
    if (!modalInput.length) {
      Toast.fail('请先输入内容');
      return;
    }
    Toast.loading();
    try {
      const { data } = await axios.post('/api/user/reserve', {
        teacher: props.history.location.pathname.split('/').slice(-1)[0],
        remark: modalInput,
      });
      if (data.success) {
        Toast.success('预约成功');
        setShowModal(false);
      } else {
        Toast.fail(data.err);
      }
    } catch {
      Toast.fail('网络异常');
    }
  };

  return (
    <>
      <Card
        className={styles.card}
        style={{ width: '100%', height: '100%' }}
        bordered={false}
        actions={
          !loading && [
            <div
              style={{
                height: 40,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
              onClick={() => {
                if (!getUmiCookie()) {
                  Toast.fail('请先登录');
                  return;
                }
                history.push(
                  `/chat/${
                    props.history.location.pathname.split('/').slice(-1)[0]
                  }`,
                );
              }}
            >
              <CommentOutlined />
              联系TA
            </div>,
            <div
              style={{
                height: 40,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
              onClick={hanlePost}
            >
              <CarryOutOutlined />
              预约课程
            </div>,
          ]
        }
      >
        <Skeleton loading={loading} avatar active>
          {!loading && (
            <>
              <Meta
                avatar={<Avatar src={`/public/${info.avatar}`} />}
                title={
                  <>
                    {info.name}
                    <span
                      style={{
                        marginLeft: 8,
                        fontWeight: 'normal',
                        opacity: 0.9,
                      }}
                    >
                      {info.age}岁
                    </span>
                  </>
                }
                description={
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <span>
                      <CheckCircleOutlined
                        style={{ color: '#0084c9', marginRight: 8 }}
                      />
                      认证{info.isTeacher ? '专职教师' : '在校学生'}
                    </span>
                    <span style={{ marginLeft: 'auto' }}>
                      浏览量:{info.visitCount}
                    </span>
                  </div>
                }
              />
              <List renderHeader="基本信息">
                <List.Item
                  extra={
                    <>
                      {info.group1.split('').map(v => (
                        <span
                          key={v}
                          style={{ backgroundColor: 'greenyellow' }}
                        >
                          {v}
                        </span>
                      ))}
                    </>
                  }
                >
                  可授年级
                </List.Item>
                <List.Item
                  extra={
                    <>
                      {info.group2.split('').map(v => (
                        <span key={v} style={{ backgroundColor: '#0084c9' }}>
                          {v}
                        </span>
                      ))}
                    </>
                  }
                >
                  可授课程
                </List.Item>
                <List.Item extra={info.area}>地区</List.Item>
                <List.Item extra={moment(info.time).fromNow()}>
                  上次活跃
                </List.Item>
                <List.Item extra={info.school}>学校</List.Item>
                <List.Item extra={info.profession}>专业</List.Item>
                <List.Item extra={info.level === 1 ? '研究生' : '本科'}>
                  学历
                </List.Item>
              </List>
              <List renderHeader="自我介绍" className="antbody">
                <pre>{info.introduce}</pre>
              </List>
              <List renderHeader="评价" className="antbody">
                <div className={styles.command}>
                  {!command.length && (
                    <div className={styles.empty}>暂无评价</div>
                  )}
                  {command.map(v => (
                    <React.Fragment key={v.time}>
                      <div>{moment(v.time).fromNow()}:</div>
                      <div>{v.detail}</div>
                    </React.Fragment>
                  ))}
                </div>
              </List>
            </>
          )}
        </Skeleton>
      </Card>
      <Modal
        visible={showModal}
        transparent
        footer={[
          {
            text: '取消',
            onPress: () => {
              setShowModal(false);
            },
          },
          {
            text: '提交',
            onPress: () => {
              pressPost();
            },
          },
        ]}
      >
        <TextareaItem
          rows={4}
          placeholder="输入课程要求和时间,并等待教师查看确认，可在我的页面查看结果"
          count={100}
          value={modalInput}
          onChange={value => {
            setModalInput(value);
          }}
        />
      </Modal>
    </>
  );
}

export default Detail;
