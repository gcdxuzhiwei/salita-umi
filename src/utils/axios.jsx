import axios from 'axios'; // 该处引入axios模块
import { getUmiCookie } from './const';

// 构建axios实例
const instance = axios.create({});

instance.interceptors.response.use(config => {
  if (getUmiCookie()) {
    axios.post('/api/user/setAction').then(res => {
      const { data } = res;
      if (data && data.role) {
        const oldRole = window.localStorage.getItem('role');
        if (oldRole == data.role) {
          return;
        }
        window.localStorage.setItem('role', data.role);
        const setEvent = new Event('changeRole');
        setEvent.role = data.role;
        window.dispatchEvent(setEvent);
      }
    });
  }
  return config;
});

export default instance;
