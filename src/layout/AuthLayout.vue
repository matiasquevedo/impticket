<template>

  <div class="flex-1 w-full min-h-screen bg-[#151d1a] text-[#f4f9f4] selection:bg-[#52b788]/30 selection:text-[#b7e4c7]">
    
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
      

defineProps({
  title: {
    type: String,
    default: ''
  }
})
</script>