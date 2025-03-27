<template>
    <div class="home-container">
        <h1 class="message">{{ greetingMessage }}</h1>
        <div class="slide-container bg shadow-lg rounded-lg" v-if="suggestedBooks.length > 0">
            <h2 class="mb-4">Sách được gợi ý hôm nay</h2>
            <Swiper :modules="[Autoplay, Pagination, Navigation]" :slides-per-view="1" :loop="true"
                :autoplay="{ delay: 3000 }" :pagination="{ clickable: true }" :navigation="true"
                class="swiper-container">
                <SwiperSlide v-for="(book, index) in suggestedBooks" :key="index">
                    <RouterLink :to="`book/${book.masach}`" class="book-slide">
                        <img :src="`/api/${book.hinhanh}`" class="carousel-image" alt="Thư viện sách" />
                        <div class="book-title">{{ book.tensach }}</div>
                    </RouterLink>
                </SwiperSlide>
            </Swiper>
        </div>
        <p v-else class="no-books">Không có sách nào được gợi ý.</p>
    </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth.store";
import { computed, ref, onMounted } from "vue";
import sachService from "@/services/sach.service";

// Import Swiper
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { RouterLink } from "vue-router";

// Lấy thông tin đăng nhập
const authStore = useAuthStore();
const greetingMessage = computed(() => {
    if (!authStore.user) return "Chào mừng bạn đến với hệ thống quản lý mượn sách!";
    if (authStore.type === "nhanvien" || authStore.type === "admin") return `Xin chào ${authStore.user.hotennv || ""}`;
    if (authStore.type === "docgia") return `Xin chào ${authStore.user.hoten || ""}`;
    return "Xin chào!";
});

// Lấy danh sách sách
const books = ref([]);
const fetchBooks = async () => {
    try {
        books.value = await sachService.getAll();
    } catch (error) {
        console.error("Lỗi khi lấy sách:", error);
    }
};

// Lọc danh sách sách được gợi ý
const suggestedBooks = computed(() => books.value.filter((book) => book.goiy === true));

// Gọi API khi component được tải
onMounted(fetchBooks);
</script>

<style scoped>
.message {
    margin: 10px auto 40px;
    font-size: 24px;
    font-weight: bold;

}

.home-container {
    max-width: 700px;
    margin: auto;
    text-align: center;
}

.slide-container {
    padding: 10px;
    max-width: 600px;
}

.book-slide {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-bottom: 25px;
}

.carousel-image {
    width: 70%;
    height: 550px;
    object-fit: cover;
    border-radius: 10px;
}

.book-title {
    margin-top: 10px;
    font-size: 18px;
    font-weight: bold;
    color: #333;
}

.no-books {
    font-size: 16px;
    color: gray;
    margin-top: 20px;
}

.swiper-container {
    width: 100%;
}
</style>
