<template>
  <div class="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
    <nav class="pointer-events-auto w-full max-w-6xl h-16 flex items-center justify-between px-6 bg-[#1e2824]/80 backdrop-blur-xl rounded-2xl border border-white/[0.04] shadow-2xl shadow-[#52b788]/5 transition-all duration-300">
      
      <div class="flex items-center gap-6">
        <RouterLink to="/" class="flex items-center transform transition-all duration-200 hover:scale-105 active:scale-95">
          <div class="p-1.5 bg-[#52b788]/10 rounded-xl border border-[#52b788]/20">
            <img src="../assets/logo.svg" width="32" height="32" alt="Tabaterio Logo" class="drop-shadow-md" />
          </div>
        </RouterLink>

        <div class="hidden sm:flex items-center gap-5">
          <RouterLink 
            to="/" 
            class="relative text-sm font-bold tracking-wide transition-colors duration-200 text-[#9db4a9] hover:text-white h-16 flex items-center"
            active-class="text-white"
          >
            <span>Home</span>
            <span v-if="route.path === '/'" class="absolute bottom-0 left-0 right-0 h-1 bg-[#52b788] rounded-t-full"></span>
          </RouterLink>
          

        </div>
      </div>

      <div class="flex items-center gap-4">

        <div class="h-6 w-[1px] bg-white/10 mx-1"></div>


      </div>

    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import pb from '@/lib/pocketbase'
import { Logout } from '@vicons/tabler'


const route = useRoute()
const router = useRouter()




const statusClasses = computed(() => {
  switch (store.phase) {
    case 'work':
      // Verde menta/salvia para concentración orgánica
      return 'bg-[#52b788] text-[#151d1a] shadow-[#52b788]/30' 
    case 'prepare':
      return 'bg-[#74c69d] text-[#151d1a] shadow-[#74c69d]/30'
    case 'pause':
      // Terracota/Arcilla para descanso cálido
      return 'bg-[#e07a5f] text-white shadow-[#e07a5f]/30'
    default:
      return 'bg-[#2a3832] text-[#f4f9f4] border border-white/[0.04]'
  }
})


const dotClasses = computed(() => (store.phase === 'stop' ? 'bg-[#9db4a9]' : 'bg-white'))
const pingClasses = computed(() => dotClasses.value)
</script>