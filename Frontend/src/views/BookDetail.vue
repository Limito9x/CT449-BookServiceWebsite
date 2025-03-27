<template>
    <div class="profile-container">
        <!-- Avatar -->
        <div class="avatar">
            <img v-if="book.hinhanh" :src="`/api/${book.hinhanh}`" alt="Avatar">
        </div>
        <!-- Thông tin cá nhân -->
        <div class="info">
            <Label class="text-4xl">Thông tin sách</Label>
            <div class="field p-3 max-w-md mx-auto">
                <template v-for="field in fields" :key="field.key">
                    <div class="grid grid-cols-2 gap-2" v-if="field.key !== 'hinhanh'">
                        <p class="font-semibold">{{ field.label }}</p>
                        <p>{{ field.value }}</p>
                    </div>
                </template>
            </div>
        </div>
    </div>
    <div v-if="authStore.isAdmin()" class="flex gap-2 mt-3">
        <Button class="bg-blue-600 hover:bg-blue-700" @click="toggleDialog()">Cập nhật</Button>
        <Button class="suggest bg-yellow-500 hover:bg-yellow-600 " @click="toggleSuggest()">
            <p v-if="!book.goiy">Thêm vào gợi ý</p>
            <p v-else>Bỏ gợi ý</p>
        </Button>
        <Button class="bg-red-600 hover:bg-red-700" @click="confirmDelete(book.masach, book.tensach)">Xóa</Button>
    </div>
    <Button v-if="!authStore.isStaff()" @click="borrow(book.masach)" class="mt-3 bg-green-600 hover:bg-green-500">Mượn
        sách</Button>
    <GenericDialog :title="selectedTitle" v-model:open="dialogOpen" :data="book" @save="updateBook"
        @fileSelected="getUpdatedFile" :fields="fields">
    </GenericDialog>
</template>

<script setup>
import GenericDialog from '@/components/GenericDialog.vue';
import Label from '@/components/ui/label/Label.vue';
import { ref, onMounted, computed } from 'vue';
import Button from '@/components/ui/button/Button.vue';
import SachService from '@/services/sach.service';
import muonsachService from '@/services/muonsach.service';
import { useAuthStore } from '@/stores/auth.store';
import { useToastStore } from '@/stores/toast.store';
import router from '@/router';
import { useRoute } from 'vue-router';

const route = useRoute();
const toast = useToastStore();
const authStore = useAuthStore();
const updatedFile = ref(null);
const selectedTitle = ref("")
const book = ref({})
const dialogOpen = ref(false);

const fetchBook = async () => {
    try {
        book.value = await SachService.get(route.params.id);
    } catch (error) {
        console.error("Lỗi khi lấy sách:", error);
        router.replace("/not-found");
    }
};


onMounted(fetchBook);

const fields = computed(() => [
    { key: 'tensach', label: 'Tên sách:', value: book.value.tensach },
    { key: 'dongia', min: 1000, type: 'number', label: 'Đơn giá:', value: book.value.dongia },
    { key: 'soquyen', min: 0, type: 'number', label: 'Số quyển:', value: book.value.soquyen },
    { key: 'namxuatban', type: 'number', label: 'Năm xuất bản:', value: book.value.namxuatban },
    { key: 'manxb', label: 'Nhà xuất bản:', type: 'nxb', value: book.value.tennxb },
    { key: 'tacgia', label: 'Tác giả:', value: book.value.tacgia },
    { key: 'hinhanh', type: 'file', label: 'Hình ảnh:', value: book.value.hinhanh },
])

const confirmDelete = async (masach, tensach) => {
    if (confirm(`Bạn có chắc chắn muốn xóa sách ${tensach} không?`)) {
        try {
            const response = await SachService.delete(masach);
            router.push("/books")
        } catch (error) {
            console.error('Lỗi khi xóa sách:', error);
        }
    }
};

const toggleDialog = () => {
    selectedTitle.value = `Cập nhật sách ${book.value.tensach}`;
    dialogOpen.value = true; // Mở dialog khi nhấn nút
};

const getUpdatedFile = (file) => {
    if (file) updatedFile.value = file;
    else updatedFile.value = null;
}

const updateBook = async (updatedBook) => {
    const response = await SachService.update(updatedBook.masach, updatedBook, updatedFile.value);
    await fetchBook();
    toast.showSuccess(response.message);
}

const toggleSuggest = async () => {
    const newStatus = !book.goiy; // Lưu trạng thái mới trước khi cập nhật
    await SachService.update(route.params.id, { goiy: newStatus }, null);
    await fetchBook();
    book.goiy = newStatus; // Cập nhật trạng thái mới vào biến book
    toast.showInfo(newStatus ? "Đã thêm sách vào gợi ý" : "Đã loại khỏi gợi ý");
};


const borrow = async (masach) => {
    if (!authStore.token) {
        if (confirm("Bạn cần đăng nhập để mượn sách!")) router.push("/login")
    }
    else try {
        const borrowData = { madocgia: authStore.user.madocgia, masach }
        const response = await muonsachService.create(borrowData);
        fetchBook();
        toast.showSuccess(response.message);
    }
    catch (error) {
        console.error("Lỗi khi yêu cầu mượn sách ", error);
        const errorMessage = error.response?.data?.message || "Lỗi không xác định!";
        toast.showError(errorMessage);
    }
}

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

/* Ảnh sách */
.avatar img {
    width: 400px;
}

/* Thông tin sáchn */
.info {
    width: 100%;
    text-align: center;
}

.field {
    text-align: left;
    font-size: 22px;
}

.suggest * {
    margin: auto;
}

@media (max-width: 768px) {
    .profile-container {
        flex-direction: column;
        width: 100%;
        padding: 20px;
    }

    .avatar img {
        width: 250px;
    }

    .field {
        font-size: 18px;
    }
}
</style>
