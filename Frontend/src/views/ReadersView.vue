<template>
    <div class="d-flex flex-col items-center">
        <h1 class="text-center">Danh sách độc giả</h1>
        <div class="flex gap-2 mb-2 w-96">
            <p>Tìm kiếm:</p>
            <Input v-model="searchQuery" class="flex-1 w-full" placeholder="Nhập tên độc giả hoặc số điện thoại" />
        </div>
        <DataTable :columns="readerColumns" :data="readerData"></DataTable>
    </div>
</template>
<script setup>
import DataTable from '@/components/DataTable.vue';
import docgiaService from '@/services/docgia.service';
import Input from '@/components/ui/input/Input.vue';
import { onMounted, ref,computed } from 'vue';

const readerColumns = ref([
    { key: "hoten", label: "Họ và tên" },
    { key: "dienthoai", label: "Số điện thoại" },
    { key: "ngaysinh", label: "Ngày sinh" },
    { key: "phai", label: "Phái" },
    { key: "diachi", label: "Địa chỉ" },
])

const readers = ref([]);

const fetchReader = async () => {
    readers.value = await docgiaService.getAll();
}

onMounted(fetchReader);

const searchQuery = ref('');
const readerData = computed(() => {
    return readers.value.filter((reader) =>
        reader.hoten.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        reader.dienthoai.includes(searchQuery.value)
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