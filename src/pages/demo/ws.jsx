import React, { useEffect, useState } from 'react';
import { Button, List, InputItem, Toast } from 'antd-mobile';
import { io } from 'socket.io-client';

const { Item } = List;

let socket;

function SampleComponent() {
  const [login, setLogin] = useState(false);
  const [name, setName] = useState('');
  const [chat, setChat] = useState('');
  const [detail, setDetail] = useState([]);

  useEffect(() => {
    if (login) {
      socket = io(`ws://${location.hostname}:3333`, {
        transports: ['websocket'],
      });
      socket.emit('room', login);
      socket.on('chat', res => {
        setDetail(res);
      });
      socket.on('addChat', e => {
        setDetail(v => [e, ...v]);
      });
    }
  }, [login]);

  const handleClick = () => {
    if (!name || !chat) {
      Toast.fail('请输入用户名和内容');
      return;
    }
    socket.emit('add', {
      name,
      chat,
      room: login,
    });
    setChat('');
  };

  return (
    <>
      {!login && (
        <>
          <Button
            onClick={() => {
              setLogin('demo');
            }}
          >
            demo
          </Button>
          <Button
            onClick={() => {
              setLogin('ws');
            }}
          >
            ws
          </Button>
        </>
      )}
      {login && (
        <>
          <InputItem placeholder="用户名" value={name} onChange={setName} />
          <InputItem placeholder="内容" value={chat} onChange={setChat} />
          <Button onClick={handleClick}>发送</Button>
          {detail.map(v => (
            <Item key={v.name + v.chat + Math.random()}>
              {v.name} : {v.chat}
            </Item>
          ))}
        </>
      )}
    </>
  );
}

export default SampleComponent;
