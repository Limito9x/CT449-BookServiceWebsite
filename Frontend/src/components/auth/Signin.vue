<template>
    <div class="d-flex flex-col">
        <h1>Đăng nhập</h1>
        <form @submit.prevent="handleLogin" class="d-flex flex-col bg-white shadow-lg rounded-lg p-4 ">
            <Label for="sdt">Số điện thoại</Label>
            <Input id="sdt" v-model="acc.dienthoai" required></Input>
            <Label for="pwd">Mật khẩu</Label>
            <Input id="pwd" v-model="acc.matkhau" type="password" required></Input>
            <Button type="submit">Đăng nhập</Button>
        </form>
    </div>
</template>
<script setup>
import Label from '@/components/ui/label/Label.vue';
import Input from '@/components/ui/input/Input.vue';
import Button from '@/components/ui/button/Button.vue';
import { useAuthStore } from '@/stores/auth.store';
const authStore = useAuthStore();
import { useToastStore } from '@/stores/toast.store';
const toast = useToastStore();
import { ref } from 'vue';

const acc = ref({ dienthoai: "", matkhau: "" });

const handleLogin = async () => {
    try {
        const response = await authStore.login(acc.value);
        if (response) acc.value = { dienthoai: "", matkhau: "" };
    }
    catch (error) {
        console.error("Lỗi khi đăng nhập:", error);
    }
}
</script>
<style scoped>
@import "@/components/auth/authForm.css";
</style>