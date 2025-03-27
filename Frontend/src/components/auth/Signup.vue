<template>
    <div class="">
        <h1>Đăng ký độc giả</h1>
        <form @submit.prevent="register" class="d-flex flex-col bg-white shadow-lg rounded-lg p-4">
            <Label for="name">Họ và tên</Label>
            <Input id="name" v-model="acc.tendocgia" required></Input>
            <Label for="sdt">Số điện thoại</Label>
            <Input id="sdt" v-model="acc.dienthoai" @input="validatePhone" required></Input>
            <p v-if="error" class="error text-danger">{{ error }}</p>
            <Label for="pwd">Mật khẩu</Label>
            <Input id="pwd" v-model="acc.matkhau" required type="password"></Input>
            <Label for="rpwd">Nhập lại mật khẩu</Label>
            <Input id="rpwd" type="password" required v-model="confpwd"></Input>
            <Button type="submit" class="mt-2">Đăng ký</Button>
        </form>
    </div>
</template>
<script setup>
import Label from '@/components/ui/label/Label.vue';
import Input from '@/components/ui/input/Input.vue';
import Button from '@/components/ui/button/Button.vue';
import docgiaService from '@/services/docgia.service';
import { ref } from 'vue';
import { useToastStore } from '@/stores/toast.store';
const toast = useToastStore();

const emit = defineEmits(["update:signup"]);
const acc = ref({ tendocgia: "", dienthoai: "", matkhau: "" });
const confpwd = ref("");
const error=ref("")
const validatePhone = () => {
    const regex = /^(0[1-9][0-9]{8})$/;
    error.value = regex.test(acc.value.dienthoai) ? "" : "Số điện thoại không hợp lệ!";
};
const register = async () => {
    if (confpwd.value != acc.value.matkhau) {
        toast.showError("Mật khẩu nhập lại không trùng khớp !");
        return;
    }
    try {
        const response = await docgiaService.create(acc.value);
        toast.showSuccess("Đăng ký thành công!");
        acc.value = { tendocgia: "", dienthoai: "", matkhau: "" };
        confpwd.value = "";
        emit("update:signup",true);
    }
    catch (error) {
        toast.showError("❌ Đăng ký thất bại! " + (error.response?.data?.message || "Lỗi không xác định"));
    }
}
</script>
<style scoped>
@import "@/components/auth/authForm.css";
</style>