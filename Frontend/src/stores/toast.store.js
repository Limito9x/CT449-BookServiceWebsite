import { defineStore } from 'pinia'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

export const useToastStore = defineStore('toast', () => {
  const showSuccess = (message) => {
    toast.success(message, {
      position: 'top-right',
      autoClose: 3000,
    })
  }

  const showError = (message) => {
    toast.error(message, {
      position: 'top-right',
      autoClose: 3000,
    })
  }

  const showInfo = (message) => {
    toast.info(message, {
      position: 'top-right',
      autoClose: 3000,
    })
  }

  return { showSuccess, showError, showInfo }
})
