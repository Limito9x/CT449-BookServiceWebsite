<template>
    <div class="profile-container">
        <!-- Thông tin cá nhân -->
        <div class="info">
            <Label class="text-4xl">Thông tin cá nhân</Label>
            <div class="field p-3 max-w-md mx-auto">
                <div class="grid grid-cols-2 gap-2">
                    <template v-for="field in displayedFields" :key="field.key">
                        <p class="font-semibold">{{ field.label }}</p>
                        <p>{{ field.value }}</p>
                    </template>
                </div>
            </div>
        </div>
    </div>
    <Button @click="toggleDialog" class="mt-3 bg-blue-500 hover:bg-blue-600">Cập nhật thông tin cá nhân</Button>
    <GenericDialog :title="'Cập nhật thông tin cá nhân'" v-model:open="dialogOpen" :data="userData" @save="update"
        :fields="dataField[authStore.type]"></GenericDialog>
</template>

<script setup>
import Label from '@/components/ui/label/Label.vue';
import Button from '@/components/ui/button/Button.vue';
import { useAuthStore } from '@/stores/auth.store';
import GenericDialog from '@/components/GenericDialog.vue';
import { ref, onMounted, computed } from 'vue';
import docgiaService from '@/services/docgia.service';
import nhanvienService from '@/services/nhanvien.service';
import { useToastStore } from '@/stores/toast.store';
const toast = useToastStore();
const authStore = useAuthStore();

const today = new Date().toISOString().split('T')[0]
const dialogOpen = ref(false);

const userData = ref({});
const fetchReader = async () => {
    try {
        userData.value = await docgiaService.get(authStore.user.madocgia);
        authStore.user = userData;
    } catch (error) {
        toast.showError("Không thể tải thông tin độc giả!");
    }
};
const fetchStaff = async () => {
    try {
        userData.value = await nhanvienService.get(authStore.user.msnv);
        authStore.user = userData;
    } catch (error) {
        toast.showError("Không thể tải thông tin nhân viên!");
    }
};

const displayedFields = computed(() => {
    return [
        { key: 'hoten', label: '📑 Họ và tên:', value: userData.value.hoten || userData.value.hotennv || "..." },
        { key: 'dienthoai', label: '📞 Số điện thoại:', value: userData.value.dienthoai || userData.value.sodienthoai || "..." },
        { key: 'diachi', label: '🏠 Địa chỉ:', value: userData.value.diachi || "..." },
        authStore.type === "docgia" && { key: 'ngaysinh', label: '📆 Ngày sinh:', value: userData.value.ngaysinh || "..." },
        authStore.type === "docgia" && { key: 'phai', label: '👫 Giới tính:', value: userData.value.phai ? 'Nữ' : (userData.value.phai === false ? 'Nam' : "...") },
        (authStore.type === "nhanvien" || authStore.type === "admin") && { key: 'chucvu', label: '👨‍💼 Chức vụ:', value: userData.value.chucvu || "..." },
    ].filter(Boolean); // Loại bỏ phần tử `null` hoặc `false`
});

onMounted(() => {
    if (authStore.user?.madocgia) {
        fetchReader();
    }
    else if (authStore.user?.msnv) {
        fetchStaff();
    }
});

const toggleDialog = () => {
    dialogOpen.value = true; // Mở dialog khi nhấn nút
};

const update = async (updateData) => {
    try {
        let res = ref({});
        if (authStore.type === "docgia") {
            res = await docgiaService.update(authStore.user.madocgia, updateData);
            fetchReader();
        } else {
            res = await nhanvienService.update(authStore.user.msnv, updateData);
            fetchStaff();
        } 
        toast.showSuccess(res.message);
    }
    catch (error) {
        toast.showError(error.data.message);
    }
}

const dataField = ref({
    docgia: [
        { key: 'hoten', label: 'Họ và tên' },
        { key: 'dienthoai', label: 'Số điện thoại' },
        { key: 'ngaysinh', type: 'date', max: today, label: 'Ngày sinh' },
        { key: 'diachi', type: 'textarea', label: 'Địa chỉ' },
        { key: 'phai', type: 'gender', label: 'Giới tính' },
        // { key: 'hinhanh', type: 'file', label: 'Hình ảnh' },
    ],
    nhanvien: [
        { key: 'hotennv', label: 'Họ và tên' },
        { key: 'sodienthoai', label: 'Số điện thoại' },
        // { key: 'ngaysinh', type: 'date', max: today, label: 'Ngày sinh' },
        { key: 'diachi', type: 'textarea', label: 'Địa chỉ' },
        // { key: 'phai', type: 'gender', label: 'Giới tính' },
    ],
    admin: [
        { key: 'hotennv', label: 'Họ và tên' },
        { key: 'sodienthoai', label: 'Số điện thoại' },
        // { key: 'ngaysinh', type: 'date', max: today, label: 'Ngày sinh' },
        { key: 'diachi', type: 'textarea', label: 'Địa chỉ' },
        // { key: 'phai', type: 'gender', label: 'Giới tính' },
    ]
})
</script>

<style scoped>
/* Khung chứa avatar + thông tin */
.profile-container {
    display: flex;
    align-items: center;
    /* Căn giữa theo chiều dọc */
    gap: 30px;
    /* Khoảng cách giữa avatar và thông tin */
    background: white;
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
    width: 900px;
    margin: auto;
}

/* Ảnh đại diện */
.avatar img {
    width: 250px;
}

/* Thông tin cá nhân */
.info {
    width: 100%;
    text-align: center;
}

.field {
    text-align: left;
    font-size: 22px;
}

@media (max-width: 768px) {
    .profile-container {
        flex-direction: column;
        width: 100%;
        padding: 20px;
    }

    .avatar img {
        width: 150px;
    }

    .field {
        font-size: 18px;
    }
}
</style>
