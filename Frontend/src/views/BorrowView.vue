<template>
    <div class="d-flex flex-col items-center">
        <h1 class="text-center">Danh sách phiếu mượn</h1>
        <span class="d-flex gap-3 mb-2 text-xl">
            <div class="flex gap-2 mb-2 w-96">
                <p>Tìm kiếm:</p>
                <Input v-model="searchQuery" class="flex-1 w-full" :placeholder="placeholder" />
            </div>
            Trạng thái:
            <Select v-model="selectedStatus">
                <SelectTrigger class="w-[180px]">
                    <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Chờ duyệt">Chờ duyệt</SelectItem>
                    <SelectItem value="Đang mượn">Đang mượn</SelectItem>
                    <SelectItem value="Đã trả">Đã trả</SelectItem>
                </SelectContent>
            </Select>
        </span>
        <div class="container">
            <DataTable @updated="fetchBorrow" :status="selectedStatus" :type="'borrow'" :columns="borrowColumns"
                :data="borrowData"></DataTable>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import muonsachService from "@/services/muonsach.service";
import DataTable from "@/components/DataTable.vue";
import { useAuthStore } from "@/stores/auth.store";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import Input from "@/components/ui/input/Input.vue";
const authStore = useAuthStore();
const selectedStatus = ref("Chờ duyệt");
const baseColumns = {
    nhanvien: [
        { key: "ngaymuon", label: "Ngày mượn" },
        { key: "hoten", label: "Độc giả" },
        { key: "dienthoai", label: "Số điện thoại" },
        { key: "tensach", label: "Tên sách" },
    ],
    admin: [
        { key: "ngaymuon", label: "Ngày mượn" },
        { key: "hoten", label: "Độc giả" },
        { key: "dienthoai", label: "Số điện thoại" },
        { key: "tensach", label: "Tên sách" },
    ],
    docgia: [
        { key: "ngaymuon", label: "Ngày mượn" },
        { key: "tensach", label: "Tên sách" },
        // { key: "hantra", label: "Hạn trả" }
    ]
}
const borrowColumns = ref([...baseColumns[authStore.type]]); // Dùng ref thay vì computed

// Cập nhật cột khi trạng thái thay đổi
watch(selectedStatus, (newStatus) => {
    if (newStatus === "Đã trả") {
        borrowColumns.value = [
            baseColumns[authStore.type][0],
            { key: "ngaytra", label: "Ngày trả" }, // Chèn cột "Ngày trả"
            ...baseColumns[authStore.type].slice(1)
        ];
    } else {
        borrowColumns.value = [...baseColumns[authStore.type]]; // Quay về cột gốc
    }
});
const borrows = ref([]);
const fetchBorrow = async () => {
    if (authStore.isStaff()) borrows.value = await muonsachService.getAll();
    if (authStore.type === "docgia") borrows.value = await muonsachService.get(authStore.user.madocgia);
}

onMounted(fetchBorrow);
const placeholder = computed(() => {
    return authStore.isStaff()?"Nhập tên độc giả hoặc số điện thoại":"Nhập tên sách"
})
const searchQuery = ref('');
const borrowData = computed(() => {
    if (authStore.isStaff()) {return borrows.value.filter((borrow) =>
        borrow.hoten.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        borrow.dienthoai.includes(searchQuery.value)
    )}
    else return borrows.value.filter((borrow) =>
        borrow.tensach.toLowerCase().includes(searchQuery.value.toLowerCase()))
})
</script>
<style scoped>
.container {
    max-width: 1000px;
    width: 90%;
    overflow-x: auto;
    /* Thêm thanh cuộn ngang khi nội dung quá dài */
}

h1 {
    font-size: 24px;
    text-align: center;
}

/* Responsive cho ô tìm kiếm */
@media (max-width: 768px) {
    .search-container {
        width: 90%;
    }
}
</style>