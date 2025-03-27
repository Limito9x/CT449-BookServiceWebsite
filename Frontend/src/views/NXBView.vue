<template>
    <div v-if="authStore.isStaff()" class="flex flex-col items-center">
        <h1>Quản lý nhà xuất bản</h1>
        <form @submit.prevent="handleAddNXB"
            class="d-flex flex-col bg-white shadow-lg rounded-lg p-6 gap-4">
            <div class="flex items-center gap-2">
                <Label class="w-1/4 font-semibold">Tên NXB</Label>
                <Input v-model="newNXB.tennxb" placeholder="Tên nhà xuất bản" required class="flex-grow" />
            </div>

            <div class="flex items-center gap-2">
                <Label class="w-1/4 font-semibold">Địa chỉ</Label>
                <Input v-model="newNXB.diachi" placeholder="Địa chỉ" required class="flex-grow" />
            </div>

            <div class="flex items-center gap-2">
                <Label class="w-1/4 font-semibold">Logo</Label>
                <Input type="file" @change="handleFileChange" class="flex-grow" />
            </div>

            <Button class="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg" type="submit">
                Thêm Nhà Xuất Bản
            </Button>
        </form>
    </div>

    <h1 class="mt-2 mb-4">Danh sách nhà xuất bản</h1>
    <div class="flex gap-2 mb-4">
        <p>Tìm kiếm:</p>
        <Input v-model="searchQuery" class="flex-1" placeholder="Nhập tên nhà xuất bản" />
    </div>
    <ul class="nxb grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
        <li v-for="nxb in nxbData" :key="nxb.manxb"
            class="flex flex-col items-center text-center bg-white shadow-lg rounded-lg p-4 border border-gray-200">

            <!-- Hình ảnh nhà xuất bản -->
            <img :src="'/api' + nxb.hinhanh" class="w-40 h-full object-cover rounded-md shadow-md mb-3">

            <!-- Tên nhà xuất bản -->
            <p class="text-lg font-semibold mb-1">{{ nxb.tennxb }}</p>

            <!-- Địa chỉ nhà xuất bản -->
            <p class="text-sm text-gray-600 mb-0">{{ nxb.diachi }}</p>

            <!-- Nút hành động -->
            <div v-if="authStore.isAdmin()" class="flex gap-2 w-full mt-auto">
                <Button class="flex-1 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg"
                    @click="toggleDialog(nxb)">
                    Cập nhật
                </Button>
                <Button class="flex-1 bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg"
                    @click="confirmDelete(nxb.manxb, nxb.tennxb)">
                    Xóa
                </Button>
            </div>
        </li>

        <!-- Hiển thị nếu không có nhà xuất bản -->
        <li v-if="nxbs.length === 0" class="col-span-full text-center text-gray-500 text-lg">Không có nhà xuất bản nào
            để hiển thị.</li>
    </ul>

    <GenericDialog :title="selectedTitle" v-model:open="dialogOpen" :data="selectedNXB" @save="updateNXBs" :fields="[
        { key: 'tennxb', label: 'Tên nhà xuất bản' },
        { key: 'diachi', label: 'Địa chỉ' },
        { key: 'hinhanh', type: 'file', label: 'Hình ảnh' },
    ]" @fileSelected="getUpdatedFile"></GenericDialog>
</template>


<script setup>
import GenericDialog from '@/components/GenericDialog.vue';
import { ref, onMounted,computed } from 'vue';
import Input from '@/components/ui/input/Input.vue';
import Button from '@/components/ui/button/Button.vue';
import Label from '@/components/ui/label/Label.vue';
import nhaxuatbanService from '@/services/nhaxuatban.service';
import { useAuthStore } from '@/stores/auth.store';
import { useToastStore } from '@/stores/toast.store';

const toast = useToastStore();
const authStore = useAuthStore();

const nxbs = ref([]);
const newNXB = ref({ tennxb: '', diachi:'' });
const selectedFile = ref(null);
const dialogOpen = ref(false);
const selectedNXB = ref(null);
const selectedTitle = ref(null);
const updatedFile = ref({});

const handleFileChange = (event) => {
    selectedFile.value = event.target.files[0];
};

const fetchNXBs = async () => {
    try {
        nxbs.value = await nhaxuatbanService.getAll();
    } catch (error) {
        console.error('Lỗi khi lấy nhà xuất bản:', error);
    }
};

onMounted(fetchNXBs);

const handleAddNXB = async () => {
    try {
        const response = await nhaxuatbanService.create(newNXB.value, selectedFile.value);
        await fetchNXBs();
        toast.showSuccess(response.message);
        newNXB.value = { tennxb: '', diachi: '' };
        selectedFile.value = null;
    } catch (error) {
        console.error('Lỗi khi thêm nhà xuất bản:', error);
    }
};

const confirmDelete = async (manxb, tennxb) => {
    if (confirm(`Bạn có chắc chắn muốn xóa nhà xuất bản ${tennxb} không?`)) {
        try {
            const response = await nhaxuatbanService.delete(manxb);
            toast.showSuccess(response.message);
            await fetchNXBs();
        } catch (error) {
            console.error('Lỗi khi xóa nhà xuất bản:', error);
        }
    }
};

const toggleDialog = (nxb) => {
    selectedNXB.value = nxb;
    selectedTitle.value = `Cập nhật nhà xuất bản ${nxb.tennxb}`;
    dialogOpen.value = true; // Mở dialog khi nhấn nút
};

const getUpdatedFile = (file) => {
    if (file) updatedFile.value = file;
    else updatedFile.value = null;
}

const updateNXBs = async (updatedNXB) => {
    const response = await nhaxuatbanService.update(updatedNXB.manxb, updatedNXB, updatedFile.value);
    await fetchNXBs();
    toast.showSuccess(response.message);
}

const searchQuery = ref('');
const nxbData = computed (()=>{
    return nxbs.value.filter((nxb) => 
        nxb.tennxb.toLowerCase().includes(searchQuery.value.toLowerCase())
)
})
</script>

<style scoped>
.nxb{
    max-width: 1200px;
}
</style>