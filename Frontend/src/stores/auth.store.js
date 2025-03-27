import { defineStore } from 'pinia'
import { ref, watchEffect } from 'vue'
import {jwtDecode} from 'jwt-decode'
import axios from 'axios'
import router from '@/router'
import { useToastStore } from './toast.store'
import docgiaService from '@/services/docgia.service'
import nhanvienService from '@/services/nhanvien.service'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)
  const token = ref(localStorage.getItem('token') || '')
  const type = ref(localStorage.getItem('type') || null)
  const toast = useToastStore()
  const login = async (data) => {
    try {
      const res = await axios.post('api/auth/login', data)
      token.value = res.data.token
      user.value = res.data.userData
      user.value.hoten = `${user.value.holot} ${user.value.ten}`
      type.value = res.data.type
      // Lưu token vào localStorage để giữ đăng nhập
      localStorage.setItem('token', token.value)
      // Lưu user vào localStorage
      localStorage.setItem('user', JSON.stringify(user.value))
      localStorage.setItem('type', type.value)
      // Chuyển hướng sau khi đăng nhập thành công
      checkTokenExpiration();
      router.push('/')
    } catch (error) {
      toast.showError("Lỗi đăng nhập, hãy kiểm tra lại tài khoản!");
    }
  }
    const logout = () => {
      token.value = ''
      user.value = null
      type.value = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('type')
      router.push('/login')
    }
  // Hàm kiểm tra token hết hạn
  const checkTokenExpiration = () => {
    if (!token.value) return
    try {
      const decoded = jwtDecode(token.value)
      const expTime = decoded.exp * 1000 // Chuyển giây → mili-giây

      // 🕒 Tạo hẹn giờ tự động đăng xuất
      const timeLeft = expTime - Date.now()
      if (timeLeft > 0) {
        setTimeout(() => {
          logout()
          alert('Phiên đăng nhập đã hết hạn! Vui lòng đăng nhập lại.')
        }, timeLeft)
      } else {
        logout() // Nếu Token đã hết hạn, đăng xuất ngay lập tức
      }
    } catch (error) {
      logout() // Nếu có lỗi khi decode token, cũng logout
    }
  }
  // 🕒 Gọi checkTokenExpiration() khi Pinia Store được khởi tạo
  watchEffect(() => {
    checkTokenExpiration()
  })
  const isStaff = () => {
    if (type.value === 'nhanvien' || type.value == 'admin') return true
    else return false
  }
  const isAdmin = () => {
    return type.value==='admin';
  }
  return { user, token, type, login, isStaff, isAdmin, logout, checkTokenExpiration }
})
