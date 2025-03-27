<template>
    <div class="not-found">
        <h1>404</h1>
        <p>Trang bạn tìm kiếm không tồn tại.</p>
        <!-- <img class="rounded-xl" src="../assets/images/stop.jpg"> -->
        <RouterLink to="/">Quay về trang chủ</RouterLink>
    </div>
</template>

<style scoped>
.not-found {
    text-align: center;
    margin-top: 50px;
}

h1 {
    font-size: 5rem;
    color: red;
}

p {
    font-size: 1.5rem;
}

a {
    display: inline-block;
    margin-top: 20px;
    font-size: 1.2rem;
    color: blue;
}
</style>
