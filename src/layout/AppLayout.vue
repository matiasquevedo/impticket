<template>

  <Nav />
  <div class="flex-1 w-full min-h-screen bg-[#fafaf9] text-[#272822]">
    
    <div class="h-24"></div>

    <header v-if="title || $slots.header" class="pt-6 pb-6">
      <div class="max-w-5xl mx-auto px-6">
        
        <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
          <div>

            <h1 v-if="title" class="text-4xl md:text-5xl font-black tracking-tight text-white">
              {{ title }}
            </h1>
          </div>

          <div class="flex items-center gap-3">
            <slot name="header" />
          </div>
        </div>

      </div>
    </header>

    <main class="pb-24">
      <div class="mx-auto px-12">
        <slot />
      </div>
    </main>

  </div>
</template>

<script setup lang="ts">
      
import Nav from '@/layout/Nav.vue'

defineProps({
  title: {
    type: String,
    default: ''
  }
})
</script>