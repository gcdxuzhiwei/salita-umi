import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  title: '家教服务平台',
  proxy: {
    '/api/upload': {
      target: 'http://xzw.link/',
      changeOrigin: true,
    },
    '/api': {
      target: 'http://127.0.0.1:7001/',
      changeOrigin: true,
    },
    '/public': {
      target: 'http://xzw.link/',
      changeOrigin: true,
    },
  },
  hash: true,
  routes: [
    {
      path: '/main',
      exact: true,
      redirect: '/main/home',
    },
    {
      path: '/admin',
      exact: true,
      redirect: '/admin/home',
    },
    {
      path: '/main',
      component: '@/pages/main',
      routes: [
        { path: '/main/home', exact: true, component: '@/pages/main/home' },
        { path: '/main/mine', exact: true, component: '@/pages/main/mine' },
        {
          path: '/main/teacher',
          exact: true,
          component: '@/pages/main/teacher',
        },
        {
          path: '/main/message',
          exact: true,
          component: '@/pages/main/message',
        },
        { path: '*', component: '@/pages/wrong' },
      ],
    },
    {
      path: '/admin',
      component: '@/pages/admin',
      routes: [
        { path: '/admin/home', exact: true, component: '@/pages/admin/home' },
        { path: '*', component: '@/pages/wrong' },
      ],
    },
    {
      path: '/login',
      component: '@/pages/login',
    },
    {
      path: '/join',
      component: '@/pages/join',
    },
    {
      path: '/detail/:id',
      component: '@/pages/detail',
    },
    {
      path: '/reserve',
      component: '@/pages/reserve',
    },
    {
      path: '/demo',
      component: '@/pages/demo',
    },
    {
      path: '/demo/register',
      component: '@/pages/demo/register',
    },
    {
      path: '/demo/re',
      component: '@/pages/demo/demo',
    },
    {
      path: '/demo/ws',
      component: '@/pages/demo/ws',
    },
    {
      path: '/',
      component: '@/pages/index',
    },
    {
      path: '*',
      component: '@/pages/wrong',
    },
  ],
});
