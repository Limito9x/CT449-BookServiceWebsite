<template>
    <div class="table-container">
        <Table class="max-w-full mx-auto border border-gray-500 rounded-lg shadow-md">
            <TableHeader>
                <TableRow>
                    <TableHead v-for="column in props.columns" :key="column.key" :style="{ maxWidth: column.maxWidth }"
                        class="font-bold text-black-600">
                        {{ column.label }}
                    </TableHead>
                    <TableHead v-if="showAction()" class="font-bold text-black-600">
                        Hành động
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow v-for="row in filteredRequests" :key="row._id">
                    <TableCell v-for="column in columns" :key="column.key" :style="{ maxWidth: column.maxWidth }">
                        {{ row[column.key] }}
                    </TableCell>
                    <TableCell v-if="showAction()">
                        <span v-if="props.status === 'Chờ duyệt'" class="p-2 flex gap-2">
                            <button class="px-3 py-1 bg-green-500 text-white rounded"
                                @click="updateBorrow(row._id, row.trangthai)">Duyệt</button>
                            <button class="px-3 py-1 bg-red-500 text-white rounded" @click="rejectRequest(row._id)">Từ
                                chối</button>
                        </span>
                        <button v-if="props.status === 'Đang mượn'" class="px-3 py-1 bg-blue-500 text-white rounded"
                            @click="updateBorrow(row._id, row.trangthai)">Trả
                            sách</button>
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    </div>
</template>

<script setup>
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useToastStore } from "@/stores/toast.store";
import muonsachService from "@/services/muonsach.service";
const toast = useToastStore();
const props = defineProps(
    {
        columns: Array,
        data: Array,
        type: String,
        status: String,
    });
const emit = defineEmits(["updated"]);
import { ref, computed, watch } from "vue";
import { useAuthStore } from "@/stores/auth.store";
const authStore = useAuthStore();
// Theo dõi dữ liệu khi props.data thay đổi
const requests = ref([...props.data]);

watch(() => props.data, (newData) => {
    requests.value = [...newData];
}, { deep: true });

// Lọc dữ liệu theo trạng thái động
const filteredRequests = computed(() =>
    requests.value.filter((card) => card.trangthai === props.status)
);

const updateBorrow = async (id, trangthai) => {
    const updatedStatus = trangthai === "Đang mượn" ? "Đã trả" : "Đang mượn";
    try {
        const response = await muonsachService.update(id, { trangthai: updatedStatus });
        emit("updated");
        toast.showSuccess(response.message)
    }
    catch (error) {
        console.error("Lỗi khi cập nhật phiếu mượn ", error);
        toast.showError(error.data.message)
    }
}

const rejectRequest = async (id) => {
    try {
        const response = await muonsachService.delete(id);
        toast.showSuccess(response.message)
        emit("updated");
    }
    catch (error) {
        console.error("Lỗi khi từ chối yêu cầu mượn sách: ", error);
        toast.showError(error.data.message)
    }
}

const showAction = () => {
    if (props.type === 'borrow' && props.status !== 'Đã trả'
        && (authStore.type === 'nhanvien' || authStore.type === 'admin')) return true;
    else return false
}
</script>
<style scoped>
.table-container {
    max-width: 100%;
    overflow-x: auto;
}
* {
    font-size: 18px;
}
</style>
