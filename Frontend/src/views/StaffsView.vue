<template>
    <div class="d-flex flex-col items-center">
        <div v-if="authStore.isAdmin()">
            <h1>Quản lý nhân viên</h1>
            <form @submit.prevent="register" class="d-flex flex-col bg-white shadow-lg rounded-lg p-4">
                <Label for="name">Họ và tên</Label>
                <Input id="name" v-model="acc.hotennv" required></Input>
                <Label for="sdt">Số điện thoại</Label>
                <Input id="sdt" v-model="acc.dienthoai" @input="validatePhone" required></Input>
                <p v-if="error" class="error text-danger">{{ error }}</p>
                <Label for="pwd">Mật khẩu</Label>
                <Input id="pwd" v-model="acc.matkhau" required type="password"></Input>
                <Label for="rpwd">Nhập lại mật khẩu</Label>
                <Input id="rpwd" type="password" required v-model="confpwd"></Input>
                <Button type="submit" class="mt-2">Thêm nhân viên</Button>
            </form>
        </div>
        <h1 class="text-center mt-4 mb-4">Danh sách nhân viên</h1>
        <div class="flex gap-2 mb-2 w-96">
            <p>Tìm kiếm:</p>
            <Input v-model="searchQuery" class="flex-1 w-full" placeholder="Nhập tên nhân viên hoặc số điện thoại" />
        </div>
        <DataTable :columns="staffColumns" :data="staffData"></DataTable>
    </div>
</template>
<script setup>
import Label from '@/components/ui/label/Label.vue';
import Input from '@/components/ui/input/Input.vue';
import Button from '@/components/ui/button/Button.vue';
import DataTable from '@/components/DataTable.vue';
import nhanvienService from '@/services/nhanvien.service';
import { useAuthStore } from '@/stores/auth.store';
import { useToastStore } from '@/stores/toast.store';
import { onMounted, ref, computed } from 'vue';

const toast = useToastStore();
const authStore = useAuthStore();
const staffColumns = ref([
    { key: "hotennv", label: "Họ và tên" },
    { key: "sodienthoai", label: "Số điện thoại" },
    { key: "chucvu", label: "Chức vụ" },
    { key: "diachi", label: "Địa chỉ" },
])

const staffs = ref([]);
const fetchStaff = async () => {
    staffs.value = await nhanvienService.getAll();
}

onMounted(fetchStaff);

const emit = defineEmits(["update:signup"]);
const acc = ref({ hotennv: "", dienthoai: "", matkhau: "" });
const confpwd = ref("");
const error = ref("")
const validatePhone = () => {
    const regex = /^(0[1-9][0-9]{8})$/;
    error.value = regex.test(acc.value.dienthoai) ? "" : "Số điện thoại không hợp lệ!";
};
const register = async () => {
    if (confpwd.value != acc.value.matkhau) {
        alert("Mật khẩu nhập lại không trùng khớp !");
        return;
    }
    try {
        const response = await nhanvienService.create(acc.value);
        toast.showSuccess("Thêm nhân viên thành công!");
        acc.value = { hotennv: "", dienthoai: "", matkhau: "" };
        confpwd.value = "";
        emit("update:signup", true);
        await fetchStaff();
    }
    catch (error) {
        console.error("Lỗi khi thêm nhân viên:", error);
        toast.showError("Đăng ký thất bại! " + (error.response?.data?.message || "Lỗi không xác định"));
    }
}

const searchQuery = ref('');
const staffData = computed(() => {
    return staffs.value.filter((staff) =>
        staff.hotennv.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
        staff.sodienthoai.includes(searchQuery.value)
    )
})
</script>
<style scoped>
form {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 300px;
    margin: auto;
}

button {
    margin-top: 10px;
    background-color: #007bff;
    color: white;
    padding: 8px;
    border-radius: 5px;
    border: none;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}
</style>