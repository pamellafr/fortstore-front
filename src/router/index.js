import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/cosmetics',
    name: 'Cosmetics',
    component: () => import('../views/Cosmetics.vue'),
  },
  {
    path: '/cosmetic/:id',
    name: 'CosmeticDetail',
    component: () => import('../views/CosmeticDetail.vue'),
    props: true,
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/library',
    name: 'Library',
    component: () => import('../views/Library.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/history',
    name: 'History',
    component: () => import('../views/History.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('../views/Users.vue'),
  },
  {
    path: '/user/:id',
    name: 'UserProfile',
    component: () => import('../views/UserProfile.vue'),
    props: true,
  },
  {
    path: '/bundles',
    name: 'Bundles',
    component: () => import('../views/Bundles.vue'),
  },
  {
    path: '/bundle/:id',
    name: 'BundleDetail',
    component: () => import('../views/BundleDetail.vue'),
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

router.beforeEach(async (to, from, next) => {
  try {
    const authStore = useAuthStore();
    
    if (!authStore.user && !authStore.isAuthenticated) {
      await authStore.fetchUser();
    }
    
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      next({ name: 'Login', query: { redirect: to.fullPath } });
    } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
      next({ name: 'Home' });
    } else {
      next();
    }
  } catch (error) {
    next();
  }
});

export default router;

