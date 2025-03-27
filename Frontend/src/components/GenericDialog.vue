<template>
    <Dialog v-model:open="props.open" @update:open="emit('update:open', $event)" @click.self="closeDialog">
        <DialogContent>
            <DialogHeader class="dialog">
                <!-- <DialogTitle>Cập nhật sách<br>{{ props.book.tensach }}</DialogTitle> -->
                <DialogTitle>{{ props.title }}</DialogTitle>
            </DialogHeader>
            <div v-for="field in props.fields" :key="field.key">
                <Label :for="field.key">{{ field.label }}</Label>
                <Select v-if="field.type==='gender'" :id="field.key" v-model="localData[field.key]">
                    <SelectTrigger class="w-[180px]">
                        <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value=false>Nam</SelectItem>
                        <SelectItem value=true>Nữ</SelectItem>
                    </SelectContent>
                </Select>
                <Select v-else-if="field.type === 'nxb'" :id="field.key" v-model="localData[field.key]">
                    <SelectTrigger class="">
                        <SelectValue placeholder="Chọn nhà xuất bản" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem v-for="nxb in nxbs" :value="nxb.manxb">{{ nxb.tennxb }}</SelectItem>
                    </SelectContent>
                </Select>
                <Input v-else-if="field.type !== 'file'" :id="field.key" v-model="localData[field.key]"
                    :type="field.type || 'text'" :required="field.required || false" :min="field.min"
                    :max="field.max" />
                <Input v-else :id="field.key" type="file" @change="handleFileChange($event)" />
            </div>
            <DialogFooter>
                <Button @click="saveChanges">Save</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script setup>
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import Button from './ui/button/Button.vue';
import Input from './ui/input/Input.vue';
import Label from './ui/label/Label.vue';
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import nhaxuatbanService from '@/services/nhaxuatban.service';
import { watch, ref,onMounted } from 'vue';

const props = defineProps({ open: Boolean, data: Object, title: String, fields: Array });
const emit = defineEmits(["update:open", "save", "fileSelected"]);
const nxbs = ref({})
const fetchNXB = async () => {
    try {
        nxbs.value = await nhaxuatbanService.getAll();
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu NXB", error);
    }
}
onMounted(fetchNXB);
const localData = ref({});
watch(() => props.data, (newData) => {
    localData.value = { ...newData }; //Tạo bản sao của dữ liệu từ cha truyền đến
},
    { immediate: true, deep: true }
)

const closeDialog = () => {
    emit("update:open", false); // Gửi event để đóng Dialog
};

const saveChanges = async () => {
    emit("save", localData.value);
    closeDialog();
};

const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        emit("fileSelected", file );
    }
};

</script>
<style scoped></style>