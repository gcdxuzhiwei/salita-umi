import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'umi';
import { Spin } from 'antd';
import { Toast, Modal } from 'antd-mobile';
import { CarryOutOutlined } from '@ant-design/icons';
import moment from 'moment';
import zh from 'moment/locale/zh-cn';
import axios from '@/utils/axios';
import { getUmiCookie } from '@/utils/const';
import ChangeInfo from '../component/changeInfo';
import styles from './index.less';

moment.locale('zh-cn', zh);

function Mine() {
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [time, setTime] = useState(moment().format('a'));
  const [changeModal, setChangeModal] = useState(false);

  const login = useRef(!!getUmiCookie());
  const changeDOM = useRef(null);

  useEffect(() => {
    if (login.current) {
      getInfo();
    }
  }, [login.current]);

  const getInfo = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/user/info');
      setTime(moment().format('a'));
      setUserInfo(data);
      setLoading(false);
    } catch {
      Toast.fail('网络异常', 1);
    }
  };

  return (
    <>
      {!login.current ? (
        <Link to="/login" className={styles.login}>
          登录/注册
        </Link>
      ) : (
        <>
          <Spin spinning={loading}>
            <div className={styles.head}>
              {!loading && (
                <>
                  <img src={'/public/' + userInfo.avatar} />
                  <div className={styles.info}>
                    <div>{time}好</div>
                    <div>
                      {userInfo.name} {userInfo.role === 2 ? '教员' : '同学'}
                    </div>
                  </div>
                  <div
                    className={styles.change}
                    onClick={() => {
                      setChangeModal(true);
                    }}
                  >
                    修改信息<i className="iconfont icon-you"></i>
                  </div>
                </>
              )}
            </div>
          </Spin>

          <div className={styles.list}>
            <Link to="/join">
              <span>
                <i className="iconfont icon-jiarujiazuxianxing"></i>教员入驻
              </span>
              <i className="iconfont icon-Group-"></i>
            </Link>
            <Link to="/reserve">
              <span>
                <i className="iconfont icon-zhaokecheng"></i>
                我的预约
              </span>
              <i className="iconfont icon-Group-"></i>
            </Link>
            <Link to="/login">
              <span>
                <i className="iconfont icon-jiaohuan"></i>切换用户
              </span>
              <i className="iconfont icon-Group-"></i>
            </Link>
          </div>

          <Modal
            visible={changeModal}
            transparent
            footer={[
              {
                text: '取消',
                onPress: () => {
                  setChangeModal(false);
                },
              },
              {
                text: '提交',
                onPress: () => {
                  changeDOM.current.handleChange();
                },
              },
            ]}
          >
            <ChangeInfo
              info={userInfo}
              ref={changeDOM}
              getInfo={getInfo}
              closeModal={() => {
                setChangeModal(false);
              }}
            />
          </Modal>
        </>
      )}
    </>
  );
}

export default Mine;
