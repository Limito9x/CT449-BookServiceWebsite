<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store';
const authStore = useAuthStore();
const route = useRoute();
const confirmLogOut = () => {
  if (confirm(`Bạn có chắc muốn đăng xuất tài khoản `)) authStore.logout();
}
</script>

<template>
  <header v-if="route.path !== '/login'">
    <div class="login d-flex gap-5">

      <RouterLink v-if="authStore.token" class="top account" to="/profile">Tài khoản <i class="fa fa-user" title="Thông tin cá nhân"></i>
      </RouterLink>
      <div @click="confirmLogOut" v-if="authStore.token" class="top">
        Đăng xuất <font-awesome-icon icon="sign-out-alt" />
      </div>
      <RouterLink class="top" v-else to="/login">Đăng nhập <font-awesome-icon icon="sign-in-alt" /></RouterLink>
    </div>
    <nav>
      <RouterLink to="/">Trang chủ</RouterLink>
      <RouterLink to="/books">Sách</RouterLink>
      <RouterLink to="/publishers">Nhà xuất bản</RouterLink>
      <span v-if="authStore.isStaff()">
        <RouterLink to="/staffs">Nhân viên</RouterLink>
        <RouterLink to="/readers">Độc giả</RouterLink>
      </span>
      <RouterLink v-if="authStore.token" to="/borrows">Phiếu mượn</RouterLink>
    </nav>
  </header>
  <main class=" mt-3 d-flex flex-col items-center">
    <RouterView />
  </main>

</template>

<style scoped>
header {
  display: flex;
  flex-direction: column;
  /* Căn đều hai bên */
  align-items: flex-end;
  /* Căn giữa theo chiều dọc */
  padding: 10px;
  font-size: 28px;
  background-color: rgb(121, 250, 153);
}

nav {
  width: 100%;
  text-align: center;
  margin-top:5px;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  color: black;
  text-decoration: none;
}

nav a.router-link-exact-active {
  color: blue;
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

.top {
  font-size: 22px;
  color: black;
  cursor: pointer;
  margin-right: 5px;
}
.top:hover,.account.router-link-exact-active{
  color: blue;
  text-decoration: none;
}
</style>
