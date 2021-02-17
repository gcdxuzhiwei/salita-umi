import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  title: '家教服务平台',
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:7001/',
      changeOrigin: true,
    },
    '/public': {
      target: 'http://127.0.0.1:1111/',
      changeOrigin: true,
      pathRewrite: { '^/public': '' },
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
      path: '/login',
      component: '@/pages/login',
    },
    {
      path: '/detail',
      component: '@/pages/detail',
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
