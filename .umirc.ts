import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  title: '某知名家教服务平台',
  styles: ['http://at.alicdn.com/t/font_2160910_atovnysy6f.css'],
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:7001/',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
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
        { path: '*', component: '@/pages/wrong' },
      ],
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
      path: '/',
      component: '@/pages/index',
    },
    {
      path: '*',
      component: '@/pages/wrong',
    },
  ],
});
