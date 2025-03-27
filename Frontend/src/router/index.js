import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BookView from '../views/BookView.vue'
import LoginPage from '@/views/LoginPage.vue'
import StaffsView from '@/views/StaffsView.vue'
import BorrowView from '@/views/BorrowView.vue'
import ReadersView from '@/views/ReadersView.vue'
import ProfileView from '@/views/ProfileView.vue'
import NXBView from '@/views/NXBView.vue'
import BookDetail from '@/views/BookDetail.vue'
import NotFound from '@/views/NotFound.vue'
import { useAuthStore } from '@/stores/auth.store'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/books',
      name: 'book',
      component: BookView,
    },
    {
      path: '/book/:id',
      name: 'bookDetail',
      component: BookDetail,
    },
    {
      path: '/publishers',
      name: 'publisher',
      component: NXBView,
    },
    {
      path: '/staffs',
      name: 'staff',
      component: StaffsView,
      meta: { requiresAuth: true, allowedRoles: ['admin', 'nhanvien'] }, // Chỉ Admin & Nhân viên được vào
    },
    {
      path: '/readers',
      name: 'reader',
      component: ReadersView,
      meta: { requiresAuth: true, allowedRoles: ['admin', 'nhanvien'] }, // Chỉ Admin & Nhân viên được vào
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true, allowedRoles: ['admin', 'nhanvien', 'docgia'] }, // Chỉ Admin & Nhân viên được vào
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore()
        if (authStore.token) {
          next('/') // Nếu đã đăng nhập, chuyển về trang chủ
        } else {
          next() // Nếu chưa đăng nhập, cho phép vào trang
        }
      },
    },
    {
      path: '/borrows',
      name: 'borrow',
      component: BorrowView,
      meta: { requiresAuth: true, allowedRoles: ['admin', 'nhanvien', 'docgia'] },
    },
    { path: '/:catchAll(.*)',
      name: 'notfound',
      component: NotFound },
  ],
})
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const userRole = authStore.type
  if (to.meta.requiresAuth) {
    if (!authStore.token) {
      return next('/login')
    }
    if (!to.meta.allowedRoles.includes(userRole)) {
      alert("Bạn không có quyền truy cập");
      return next('/')
    }
  }
  next()
})

export default router
