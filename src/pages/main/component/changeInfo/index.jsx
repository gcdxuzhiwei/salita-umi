import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { cloneDeep } from 'lodash';
import { Upload, Button, message, Radio } from 'antd';
import { Toast, InputItem, Picker } from 'antd-mobile';
import { allArea, getAreaName } from '@/utils/const';
import axios from '@/utils/axios';
import styles from './index.less';

function ChangeInfo(props, ref) {
  console.log(allArea);
  const { info, closeModal, getInfo } = props;
  const [newInfo, setNewInfo] = useState(cloneDeep(info));
  const [avatarLoading, setAvatarLoading] = useState(false);

  useImperativeHandle(ref, () => ({
    handleChange,
  }));

  const beforeUpload = file => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传JPG/PNG图片!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const avatarChange = info => {
    if (info.file.status === 'uploading') {
      setAvatarLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      setNewInfo({
        ...newInfo,
        avatar: info.file.response.url[0],
      });
      setAvatarLoading(false);
    }
  };

  const handleChange = async () => {
    try {
      if (!newInfo.name || !newInfo.age || !newInfo.area) {
        Toast.fail('请先完善信息');
        return;
      }
      Toast.loading('上传中', 60);
      const { data } = await axios.post('/api/user/changeInfo', newInfo);
      if (data.err) {
        Toast.fail(data.err, 1);
        return;
      }
      Toast.success('修改成功', 1);
      closeModal(false);
      getInfo();
    } catch {
      Toast.fail('网络异常', 1);
    }
  };

  return (
    <>
      <div className={styles.line}>
        <span>
          头像:
          <img src={'/public/' + newInfo.avatar} />
        </span>
        <Upload
          name="avatar"
          showUploadList={false}
          action="/api/upload"
          beforeUpload={beforeUpload}
          onChange={avatarChange}
        >
          <Button loading={avatarLoading}>选择图片</Button>
        </Upload>
      </div>
      <div className={styles.line}>
        姓名:
        <InputItem
          value={newInfo.name}
          onChange={e => {
            setNewInfo({ ...newInfo, name: e });
          }}
          placeholder="请输入姓名"
          className={styles.input}
        />
      </div>
      <div className={styles.line}>
        性别:
        <Radio.Group
          onChange={e => {
            setNewInfo({ ...newInfo, sex: e.target.value });
          }}
          value={newInfo.sex}
        >
          <Radio value={0}>男</Radio>
          <Radio value={1}>女</Radio>
        </Radio.Group>
      </div>
      <div className={styles.line}>
        年龄:
        <InputItem
          value={newInfo.age}
          onChange={e => {
            setNewInfo({ ...newInfo, age: e });
          }}
          type="number"
          placeholder="请输入年龄"
          className={styles.input}
        />
      </div>
      <div className={styles.line}>
        地区:
        <Picker
          data={allArea}
          value={['110000', '110100', '110101']}
          onChange={e => {
            setNewInfo({ ...newInfo, area: getAreaName(e) });
          }}
        >
          <Button>{newInfo.area || '点击选择地区'}</Button>
        </Picker>
      </div>
    </>
  );
}

export default forwardRef(ChangeInfo);
