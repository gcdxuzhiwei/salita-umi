import React, { useEffect, useRef, useState } from 'react';
import axios from '@/utils/axios';
import { Input, Button, Spin } from 'antd';
import moment from 'moment';
import { Toast } from 'antd-mobile';
import { io } from 'socket.io-client';
import styles from './index.less';

let socket;

function Chat(props) {
  const [input, setInput] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState([]);
  const roomId = useRef('');
  const leftAvatar = useRef('');
  const rightAvatar = useRef('');
  const cloneTime = useRef(new Set());
  useEffect(() => {
    getUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      startWS();

      return () => {
        socket?.close();
      };
    }
  }, [userId]);

  useEffect(() => {
    if (detail.length === 0) {
      return;
    }
    document.getElementById(detail[detail.length - 1].time)?.scrollIntoView();
  }, [detail]);

  const getUserId = async () => {
    try {
      const { data } = await axios.post('/api/user/getId', {
        teacher: props.history.location.pathname.split('/').slice(-1)[0],
      });
      if (data.id) {
        setUserId(data.id);
        leftAvatar.current = data.teacher;
        rightAvatar.current = data.user;
      } else {
        Toast.fail(data.err);
      }
    } catch {
      Toast.fail('网络异常');
    }
  };

  const startWS = () => {
    if (userId === props.history.location.pathname.split('/').slice(-1)[0]) {
      Toast.fail('不能对自己发起聊天');
      return;
    }
    socket = io(`ws://${location.hostname}:3333`, {
      transports: ['websocket'],
    });
    socket.on('allList', v => {
      if (detail.length) {
        return;
      }
      setLoading(false);
      roomId.current = v.roomId;
      setDetail(v.detail);
    });
    socket.on('addItem', item => {
      setDetail(v => [...v, item]);
    });
    socket.emit('userId', [
      userId,
      props.history.location.pathname.split('/').slice(-1)[0],
    ]);
  };

  const handleSend = () => {
    socket.emit('addItem', {
      roomId: roomId.current,
      userId,
      info: input,
    });
    setInput('');
  };

  return (
    <>
      <Spin spinning={loading}>
        <div className={styles.list}>
          {detail.map((v, i) => {
            if (i === 0) {
              cloneTime.current.clear();
            }
            let res = null;
            const t = moment(v.time).format('YYYY/MM/DD HH:mm');
            if (!cloneTime.current.has(t)) {
              cloneTime.current.add(t);
              res = <div className={styles.time}>{t}</div>;
            }
            if (v.userId === userId) {
              return (
                <React.Fragment key={v.time}>
                  {res}
                  <div id={v.time} className={styles.right}>
                    <img src={`/public/${rightAvatar.current}`} />
                    <div>{v.info}</div>
                  </div>
                </React.Fragment>
              );
            }
            return (
              <React.Fragment key={v.time}>
                {res}
                <div id={v.time} className={styles.left}>
                  <img src={`/public/${leftAvatar.current}`} />
                  <div>{v.info}</div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </Spin>
      <div className={styles.send}>
        <Input
          value={input}
          onChange={e => {
            setInput(e.target.value);
          }}
        />
        <Button
          type="primary"
          disabled={input.length === 0}
          onClick={handleSend}
        >
          发送
        </Button>
      </div>
    </>
  );
}

export default Chat;
