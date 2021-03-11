import React, { useEffect, useRef, useState } from 'react';
import { NoticeBar, Drawer, Toast } from 'antd-mobile';
import { Checkbox, Button, Spin } from 'antd';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroller';
import axios from '@/utils/axios';
import { logo } from '@/utils/const';
import {
  GithubOutlined,
  DownOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import styles from './index.less';

function Home() {
  const [showTip, setShowTip] = useState(false);
  const [open, setOpen] = useState(false);
  const [group1, setGroup1] = useState('');
  const [group2, setGroup2] = useState('');
  const [group3, setGroup3] = useState('01');
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBottom, setIsBottom] = useState(false);

  const realOption = useRef({
    group1: '',
    group2: '',
    group3: '01',
    lastTime: 0,
  });

  useEffect(() => {
    const arr = window.location.hostname.split('.');
    if (arr[arr.length - 1] === 'link') {
      setShowTip(true);
    }
  }, []);

  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/user/teacherList', {
        group1: realOption.current.group1,
        group2: realOption.current.group2,
        group3: realOption.current.group3,
        lastTime: realOption.current.lastTime,
      });
      realOption.current.lastTime = data.lastTime;
      setIsBottom(data.lastTime === 0);
      setList(v => [...v, ...data.arr]);
      setLoading(false);
    } catch {
      Toast.fail('网络异常');
    }
  };

  const renderSlider = () => (
    <div className={styles.check}>
      <div className={styles.group}>
        年级:
        <Checkbox.Group
          value={group1.split('')}
          onChange={g => {
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
        科目:
        <Checkbox.Group
          value={group2.split('')}
          onChange={g => {
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
        家教身份:
        <Checkbox.Group
          value={group3.split('')}
          onChange={g => {
            if (!g.length) {
              return;
            }
            setGroup3(g.join(''));
          }}
          options={[
            { label: '专职教师', value: '1' },
            { label: '学生', value: '0' },
          ]}
        />
      </div>
      <div className={styles.button}>
        <Button onClick={hanleSearch} type="primary">
          搜索
        </Button>
      </div>
    </div>
  );

  const hanleSearch = () => {
    realOption.current.group1 = group1;
    realOption.current.group2 = group2;
    realOption.current.group3 = group3;
    setList([]);
    setIsBottom(false);
    setOpen(false);
    getList();
  };

  return (
    <>
      {showTip && (
        <NoticeBar marqueeProps={{ loop: true }}>
          沪ICP备20006702号-2 毕设项目，非真实业务!!!
          <a href="https://github.com/gcdxuzhiwei" target="_blank">
            源码点击跳转github
            <GithubOutlined />
          </a>
          后台admin端口为66
        </NoticeBar>
      )}
      <div style={{ top: showTip ? 36 : 0 }} className={styles.main}>
        <div className={styles.title}>
          <img src={logo} />
          <span
            onClick={() => {
              if (!open) {
                setGroup1(realOption.current.group1);
                setGroup2(realOption.current.group2);
                setGroup3(realOption.current.group3);
              }
              setOpen(v => !v);
            }}
          >
            筛选
            <DownOutlined
              style={{
                marginLeft: 3,
                transition: 'all 0.3s',
                transform: `rotate(${open ? 180 : 0}deg)`,
              }}
            />
          </span>
        </div>
        <div className={styles.list}>
          <Drawer
            onOpenChange={v => {
              setOpen(v);
            }}
            visible
            position="top"
            sidebar={renderSlider()}
            open={open}
          >
            <InfiniteScroll
              hasMore={!isBottom && !loading}
              loadMore={getList}
              useWindow={false}
              initialLoad={false}
              pageStart={0}
            >
              <>
                {list.map(v => (
                  <div key={v.userId} className={styles.listItem}>
                    <img src={'/public/' + v.avatar} />
                    <div className={styles.name}>
                      {v.name}&nbsp; ({v.sex ? '女' : '男'})
                    </div>
                    <div className={styles.level}>
                      {v.level ? '研究生' : '本科'}
                    </div>
                    <div className={styles.isTeacher}>
                      <CheckCircleOutlined style={{ color: '#0084c9' }} />
                      认证{v.isTeacher ? '专职教师' : '在校学生'}
                    </div>
                    <div className={styles.action}>
                      上次活跃:
                      {moment(v.time).fromNow()}
                    </div>
                    <div className={styles.canTeach}>
                      可授年级、学科:
                      {v.group1.split('').map(p => (
                        <span>{p}</span>
                      ))}
                      {v.group2.split('').map(p => (
                        <span className={styles.lesson}>{p}</span>
                      ))}
                    </div>
                  </div>
                ))}
                {!isBottom && loading && (
                  <div className={styles.loading}>
                    <Spin spinning={true} />
                  </div>
                )}
                {isBottom && !loading && !list.length && <div>无数据</div>}
                {isBottom && !loading && !!list.length && (
                  <div className={styles.isBottom}>~没有更多了~</div>
                )}
              </>
            </InfiniteScroll>
          </Drawer>
        </div>
      </div>
    </>
  );
}

export default Home;
