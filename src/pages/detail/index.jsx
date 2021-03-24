import React, { useEffect, useState } from 'react';
import { Skeleton, Card, Avatar } from 'antd';
import { CommentOutlined, CarryOutOutlined } from '@ant-design/icons';
import { Toast } from 'antd-mobile';
import axios from '@/utils/axios';
import styles from './index.less';

const { Meta } = Card;

function Detail(props) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getData(...props.history.location.pathname.split('/').slice(-1));
  }, []);

  const getData = async id => {
    try {
      const { data } = await axios.post('/api/user/userDetail');
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
        actions={[
          <>
            <CommentOutlined />
            联系TA
          </>,
          <>
            <CarryOutOutlined />
            预约课程
          </>,
        ]}
      >
        <Skeleton loading={false} avatar active>
          <Meta
            avatar={
              <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
            }
            title="Card title"
            description="This is the description"
          />
        </Skeleton>
      </Card>
    </>
  );
}

export default Detail;
