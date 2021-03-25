import React, { useEffect, useState } from 'react';
import { Skeleton, Card, Avatar } from 'antd';
import {
  CommentOutlined,
  CarryOutOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { Toast, List, TextareaItem } from 'antd-mobile';
import moment from 'moment';
import axios from '@/utils/axios';
import styles from './index.less';

const { Meta } = Card;

function Detail(props) {
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState(null);

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
        setLoading(false);
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
            <>
              <CommentOutlined />
              联系TA
            </>,
            <>
              <CarryOutOutlined />
              预约课程
            </>,
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
                <pre>
                  {info.introduce +
                    info.introduce +
                    info.introduce +
                    info.introduce +
                    info.introduce +
                    info.introduce +
                    info.introduce +
                    info.introduce +
                    info.introduce +
                    info.introduce}
                </pre>
              </List>
            </>
          )}
        </Skeleton>
      </Card>
    </>
  );
}

export default Detail;
