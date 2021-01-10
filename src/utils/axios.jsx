import axios from 'axios'; // 该处引入axios模块
import {getUmiCookie} from './const'

// 构建axios实例
const instance = axios.create({});

instance.interceptors.response.use(config => {
  if(getUmiCookie()){
    axios.post('/api/user/setAction')
  }
  return config;
});

export default instance;
