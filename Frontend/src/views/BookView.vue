<template>
    <div v-if="authStore.isStaff()" class="addBook d-flex flex-column items-center">
        <h1>Quản lý sách</h1>
        <form @submit.prevent="handleAddBook"
            class="flex flex-col bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl gap-4">
            <div class="flex items-center gap-2">
                <Label class="w-1/4 font-semibold text-base">Tên sách</Label>
                <Input v-model="newBook.tensach" placeholder="Tên sách" required class="flex-grow" />
            </div>

            <div class="flex items-center gap-2">
                <Label class="w-1/4 font-semibold text-base">Đơn Giá</Label>
                <Input type="number" min="1" v-model="newBook.dongia" placeholder="Đơn giá" required
                    class="flex-grow" />
            </div>

            <div class="flex items-center gap-2">
                <Label class="w-1/4 font-semibold text-base">Số quyển</Label>
                <Input type="number" min="0" v-model="newBook.soquyen" placeholder="Số quyển" required
                    class="flex-grow" />
            </div>

            <div class="flex items-center gap-2">
                <Label class="w-1/4 font-semibold text-base">Năm xuất bản</Label>
                <Input type="number" v-model="newBook.namxuatban" placeholder="Năm xuất bản" required
                    class="flex-grow" />
            </div>

            <div class="flex items-center gap-2">
                <Label class="w-1/4 font-semibold text-base">Nhà xuất bản</Label>
                <Select v-model="newBook.manxb" class="flex-grow">
                    <SelectTrigger class="w-full">
                        <SelectValue placeholder="Chọn nhà xuất bản" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem v-for="nxb in nxbs" :value="nxb.manxb">{{ nxb.tennxb }}</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div class="flex items-center gap-2">
                <Label class="w-1/4 font-semibold text-base">Tác giả</Label>
                <Input v-model="newBook.tacgia" placeholder="Tác giả" />
            </div>

            <div class="flex items-center gap-2">
                <Label class="w-1/4 font-semibold text-base">Hình ảnh</Label>
                <Input type="file" @change="handleFileChange" class="flex-grow" />
            </div>

            <Button class="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg" type="submit">
                Thêm Sách
            </Button>
        </form>

    </div>
    <h1 class="text-center mt-2 mb-4">Danh sách sách</h1>
    <div class="flex gap-2 mb-4">
        <p>Tìm kiếm:</p>
        <Input v-model="searchQuery" class="flex-1" placeholder="Nhập tên sách" />
    </div>
    <ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <li v-for="book in bookData" :key="book.masach"
            class="flex flex-col items-center text-center shadow-md hover:shadow-2xl rounded-lg p-3 ">
            <!-- Icon ngôi sao -->
            <button v-if="authStore.isAdmin()" class="star-icon" @click="toggleSuggest(book)">
                <i :class="book.goiy ? 'fas fa-star text-yellow-500' : 'far fa-star text-gray-400'"></i>
            </button>
            <RouterLink class="flex flex-col items-center text-center h-full" :to="`/book/${book.masach}`">
                <!-- Tiêu đề sách -->
                <p class="text-lg font-semibold mb-2 h-12 flex items-center">{{ book.tensach }}</p>

                <!-- Hình ảnh sách -->
                <img v-if="book.hinhanh" :src="'/api' + book.hinhanh" class="w-40 h-full rounded-md shadow-md mb-2">
            </RouterLink>

            <!-- Thông tin sách -->
            <p class="text-sm text-gray-600">{{ book.tacgia }} ({{ book.namxuatban }})</p>

            <!-- Đơn giá sách -->
            <!-- <p class="text-lg font-semibold mb-2 h-12 flex items-center">{{ book.dongia }} đ</p> -->

            <!-- Nút hành động -->

            <div v-if="authStore.isAdmin()" class="flex gap-2 w-full mt-auto">
                <Button class="flex-1 bg-blue-600 hover:bg-blue-700" @click="toggleDialog(book)">Cập nhật</Button>
                <Button class="flex-1 bg-red-600 hover:bg-red-700"
                    @click="confirmDelete(book.masach, book.tensach)">Xóa</Button>
            </div>
            <Button v-if="!authStore.isStaff()" @click="borrow(book.masach)" class="mt-auto bg-green-600 hover:bg-green-500">Mượn
                sách</Button>
        </li>

        <!-- Hiển thị nếu không có sách -->
        <li v-if="books.length === 0" class="col-span-full text-center text-gray-500">Không có sách nào để hiển thị.
        </li>
    </ul>

    <GenericDialog :title="selectedTitle" v-model:open="dialogOpen" :data="selectedBook" @save="updateBooks" :fields="[
        { key: 'tensach', label: 'Tên sách' },
        { key: 'dongia', min: 1000, type: 'number', label: 'Đơn giá' },
        { key: 'soquyen', min: 0, type: 'number', label: 'Số quyển' },
        { key: 'namxuatban', type: 'number', label: 'Năm xuất bản' },
        { key: 'manxb', type:'nxb' ,label: 'Nhà xuất bản' },
        { key: 'tacgia', label: 'Tác giả' },
        { key: 'hinhanh', type: 'file', label: 'Hình ảnh' },
    ]" @fileSelected="getUpdatedFile"></GenericDialog>
</template>

<script setup>
import GenericDialog from '@/components/GenericDialog.vue';
import { ref, onMounted, computed } from 'vue';
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import Input from '@/components/ui/input/Input.vue';
import Label from '@/components/ui/label/Label.vue';
import Button from '@/components/ui/button/Button.vue';
import SachService from '@/services/sach.service';
import nhaxuatbanService from '@/services/nhaxuatban.service';
import muonsachService from '@/services/muonsach.service';
import { useAuthStore } from '@/stores/auth.store';
import { useToastStore } from '@/stores/toast.store';
import router from '@/router';
import { RouterLink } from 'vue-router';

const toast = useToastStore();
const authStore = useAuthStore();

const books = ref([]);
const newBook = ref({ tensach: '', dongia: "", soquyen: "", namxuatban: '', manxb: '', tacgia: '' });
const selectedFile = ref(null);
const fileInput = ref(null)
const dialogOpen = ref(false);
const selectedBook = ref(null);
const selectedTitle = ref(null);
const updatedFile = ref({});
const nxbs = ref({})

const handleFileChange = (event) => {
    selectedFile.value = event.target.files[0];
};

const fetchBooks = async () => {
    try {
        books.value = await SachService.getAll();
    } catch (error) {
        console.error('Lỗi khi lấy sách:', error);
    }
};

onMounted(fetchBooks);

const toggleSuggest = async (book) => {
    const newStatus = !book.goiy; // Lưu trạng thái mới trước khi cập nhật
    await SachService.update(book.masach, { goiy: newStatus }, null);
    await fetchBooks();
    toast.showInfo(newStatus ? "Đã thêm sách vào gợi ý" : "Đã loại khỏi gợi ý");
};

const handleAddBook = async () => {
    try {
        const response = await SachService.create(newBook.value, selectedFile.value);
        await fetchBooks();
        toast.showSuccess(response.message);
        newBook.value = { tensach: '', dongia: "", soquyen: "", namxuatban: '', manxb: '', tacgia: '' };
        selectedFile.value = null;
    } catch (error) {
        console.error('Lỗi khi thêm sách:', error);
    }
};

const confirmDelete = async (masach, tensach) => {
    if (confirm(`Bạn có chắc chắn muốn xóa sách ${tensach} không?`)) {
        try {
            const response = await SachService.delete(masach);
            toast.showSuccess(response.message);
            await fetchBooks();
        } catch (error) {
            toast.showError('Lỗi khi xóa sách:', error.data.message);
        }
    }
};

const toggleDialog = (book) => {
    selectedBook.value = book;
    selectedTitle.value = `Cập nhật sách ${book.tensach}`;
    dialogOpen.value = true; // Mở dialog khi nhấn nút
};

const getUpdatedFile = (file) => {
    if (file) updatedFile.value = file;
    else updatedFile.value = null;
}

const updateBooks = async (updatedBook) => {
    const response = await SachService.update(updatedBook.masach, updatedBook, updatedFile.value);
    await fetchBooks();
    toast.showSuccess(response.message);
}
const borrow = async (masach) => {
    if (!authStore.token) {
        if (confirm("Bạn cần đăng nhập để mượn sách!")) router.push("/login")
    }
    else try {
        const borrowData = { madocgia: authStore.user.madocgia, masach }
        const response = await muonsachService.create(borrowData);
        toast.showSuccess(response.message);
    }
    catch (error) {
        console.error("Lỗi khi yêu cầu mượn sách ", error);
        const errorMessage = error.response?.data?.message || "Lỗi không xác định!";
        toast.showError(errorMessage);
    }
}

const fetchNXB = async () => {
    try{
        nxbs.value = await nhaxuatbanService.getAll();
    } catch(error){
        console.error("Lỗi khi lấy dữ liệu NXB",error);
    }
}
onMounted(fetchNXB);
//Tìm kiếm
const searchQuery = ref("");
const bookData = computed (() => {
    return books.value.filter((book) =>
        book.tensach.toLowerCase().includes(searchQuery.value.toLowerCase())
)
})

</script>

<style scoped>
li a{
    text-decoration: none;
}
</style>