import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import axios from '@/utils/axios';
import moment from 'moment';
import { Toast } from 'antd-mobile';
import { io } from 'socket.io-client';
import styles from './index.less';

let socket;
let interval;

function Message() {
  const [userId, setUserId] = useState('');
  const [list, setList] = useState({
    old: [],
    new: [],
  });
  const [showList, setShowList] = useState([]);

  useEffect(() => {
    getUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      startWS();

      return () => {
        clearInterval(interval);
        socket.close();
      };
    }
  }, [userId]);

  useEffect(() => {
    if (JSON.stringify(list.old) !== JSON.stringify(list.new)) {
      changeInfo();
    }
  }, [list]);

  const changeInfo = async () => {
    const cloneList = JSON.parse(JSON.stringify(list.new));
    const params = [];
    for (let i = 0; i < cloneList.length; i++) {
      let flag = false;
      for (let v in cloneList[i]) {
        if (v.length === userId.length && v !== userId) {
          params.push(v);
          flag = true;
          break;
        }
      }
      if (!flag) {
        params.push('');
      }
    }
    try {
      const { data } = await axios.post('/api/user/chatListInfo', {
        ids: params.join(','),
      });
      for (let i = 0; i < cloneList.length; i++) {
        cloneList[i] = {
          ...cloneList[i],
          ...data.res[i],
        };
      }
      let hasData = cloneList.filter(v => v.detail.length);
      const noData = cloneList.filter(v => !v.detail.length);
      hasData = hasData.sort(
        (a, b) =>
          b.detail[b.detail.length - 1].time -
          a.detail[a.detail.length - 1].time,
      );
      setShowList([...hasData, ...noData]);
    } catch (e) {
      console.log(e);
    }
  };

  const getUserId = async () => {
    try {
      const { data } = await axios.post('/api/user/getId');
      if (data.id) {
        setUserId(data.id);
      } else {
        Toast.fail(data.err);
      }
    } catch {
      Toast.fail('网络异常');
    }
  };

  const startWS = () => {
    socket = io(`ws://${location.hostname}:3333`, {
      transports: ['websocket'],
    });
    socket.on('postList', arr => {
      setList(v => ({
        old: v.new,
        new: arr,
      }));
    });
    socket.emit('getList', [userId]);
    interval = setInterval(() => {
      socket.emit('getList', [userId]);
    }, 1500);
  };

  return (
    <>
      {showList.map(v => {
        return (
          <div
            key={v.room}
            className={styles.item}
            onClick={() => {
              for (let i in v) {
                if (i.length === userId.length && i !== userId) {
                  history.push(`/chat/${i}`);
                  return;
                }
              }
            }}
          >
            <img src={`/public/${v.avatar}`} />
            <div className={styles.name}>{v.name}</div>
            {v.detail.length > 0 && (
              <div className={styles.time}>
                {moment(v.detail[v.detail.length - 1].time).fromNow()}
              </div>
            )}
            {v.detail.length > 0 && (
              <div className={styles.info}>
                {v.detail[v.detail.length - 1].info}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

export default Message;
