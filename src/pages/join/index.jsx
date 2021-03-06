import React, { useEffect, useState } from 'react';
import { Link } from 'umi';
import { Spin, Upload, message, Button } from 'antd';
import {
  Steps,
  WhiteSpace,
  Toast,
  SegmentedControl,
  InputItem,
} from 'antd-mobile';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import axios from '@/utils/axios';
import styles from './index.less';

const { Step } = Steps;

const steps = [
  {
    title: '未申请',
    description: '下方可直接申请',
  },
  {
    title: '审核中',
    description: '请耐心等待,审核失败将回到未申请状态',
  },
  {
    title: '已入驻',
    description: '可发布课程',
  },
];

function Join() {
  const [state, setState] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [isTeacher, setIsTeacher] = useState(0);
  const [school, setSchool] = useState('');
  const [profession, setProfession] = useState('');
  const [level, setLevel] = useState(0);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    getState();
  }, []);

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
      setImageLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      setImageUrl(info.file.response.url[0]);
      setImageLoading(false);
    }
  };

  const getState = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/user/joinState');
      setState(data.state);
      setLoading(false);
    } catch {
      Toast.fail('网络异常', 1);
    }
  };

  const submit = async () => {
    if (!imageUrl || !school || !profession) {
      Toast.fail('请先填写资料');
      return;
    }
    try {
      setSubmitLoading(true);
      const { data } = await axios.post('/api/user/teacherJoin', {
        isTeacher,
        imageUrl,
        school,
        profession,
        level,
      });
      if (data.success) {
        setSubmitLoading(false);
        setState(-1);
        getState();
      } else {
        Toast.fail(data.err);
      }
    } catch {
      Toast.fail('网络异常', 1);
    }
  };

  return (
    <>
      <Spin spinning={loading}>
        <WhiteSpace />
        <Steps current={state} direction="horizontal" size="small">
          {steps.map((s, i) => (
            <Step
              key={i}
              title={s.title}
              description={state === i ? s.description : ''}
            />
          ))}
        </Steps>
      </Spin>
      {!loading && state === 0 && (
        <div className={styles.field}>
          <div className={styles.role}>
            教员身份:
            <SegmentedControl
              values={['在校学生', '在职教师']}
              selectedIndex={isTeacher}
              onChange={e => {
                setIsTeacher(e.nativeEvent.selectedSegmentIndex);
              }}
            />
          </div>
          <div className={styles.line}>
            院校:
            <InputItem
              value={school}
              onChange={e => {
                setSchool(e);
              }}
              placeholder="请输入院校"
              className={styles.input}
            />
          </div>
          <div className={styles.line}>
            专业:
            <InputItem
              value={profession}
              onChange={e => {
                setProfession(e);
              }}
              placeholder="请输入专业"
              className={styles.input}
            />
          </div>
          <div className={styles.role}>
            学历:
            <SegmentedControl
              values={['本科', '研究生']}
              selectedIndex={level}
              onChange={e => {
                setLevel(e.nativeEvent.selectedSegmentIndex);
              }}
            />
          </div>
          <div className={styles.photo}>
            手持{isTeacher ? '教师' : '学生'}证件照片:
            <Upload
              name="avatar"
              showUploadList={false}
              action="/api/upload"
              beforeUpload={beforeUpload}
              onChange={avatarChange}
            >
              <div className={styles.upload}>
                {imageUrl ? (
                  <img src={'/public/' + imageUrl} alt="avatar" />
                ) : (
                  <div className={styles.icon}>
                    {imageLoading ? <LoadingOutlined /> : <PlusOutlined />}
                    <div>Upload</div>
                  </div>
                )}
              </div>
            </Upload>
          </div>
          <div className={styles.submit}>
            <Button loading={submitLoading} onClick={submit} type="primary">
              提交审核
            </Button>
          </div>
        </div>
      )}
      {!loading && state !== 0 && (
        <Link className={styles.link} to="/main">
          回到首页
        </Link>
      )}
    </>
  );
}

export default Join;
