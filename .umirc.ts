import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  title: '咸鱼 不一样的家教服务平台',
  styles: ['http://at.alicdn.com/t/font_2160910_atovnysy6f.css'],
  routes: [
    {
      path: '/index',
      exact: true,
      redirect: '/index/home',
    },
    {
      path: '/index',
      component: '@/pages/index/index',
      routes: [
        { path: '/index/home', exact: true, component: '@/pages/index/home' },
        { path: '/index/mine', exact: true, component: '@/pages/index/mine' },
        { path: '*', component: '@/pages/wrong' },
      ],
    },
    {
      path: '/detail',
      exact: true,
      component: '@/pages/detail',
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
