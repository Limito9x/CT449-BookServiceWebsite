<template>
    <div class="d-flex flex-col">
        <Signin v-if="isSignin"></Signin>
        <Signup v-else v-model:signup="isSignin"></Signup>
        <div class="link" @click="switchState">
            <span v-if="isSignin">Tạo tài khoản độc giả</span>
            <span v-else>Đến đăng nhập</span>
        </div>
        <RouterLink class="link" to="/">Về trang chủ</RouterLink>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import Signin from '@/components/auth/Signin.vue';
import Signup from '@/components/auth/Signup.vue';
const isSignin = ref(true)
const switchState = () => {
    isSignin.value = !isSignin.value;
}
</script>
<style scoped>
div{
    margin: 5px auto;
    align-items: center;
}
.link{
    color: black;
    text-decoration: none;
}
.link:hover{
    color: blue;
    cursor: pointer;
}
</style>