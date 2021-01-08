import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  title: '咸鱼 不一样的家教服务平台',
  styles: ['http://at.alicdn.com/t/font_2160910_atovnysy6f.css'],
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
