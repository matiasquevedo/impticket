<template>
  <n-config-provider 
    :theme-overrides="themeOverrides"
    class="min-h-screen flex flex-col bg-[#fafaf9] font-sans tracking-tight text-[#272822]"
  >
    <n-message-provider>
      

      <main class="flex-1 flex flex-col">
        <RouterView />
      </main>

    </n-message-provider>
  </n-config-provider>

  <LoFiRadio />


</template>

<script setup lang="ts">
import { watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { NConfigProvider, NMessageProvider, type GlobalThemeOverrides } from 'naive-ui'

const route = useRoute()

/**
 * 🎨 SOBREESCRITURA DE TEMAS GLOBAL (Naive UI)
 * Rediseño con la paleta de Naturaleza (Menta, Salvia, Arcilla y Musgo)
 */
const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#ff6600',
    primaryColorHover: '#e65c00',
    primaryColorPressed: '#cc5200',
    borderRadius: '16px',
    textColorBase: '#272822',
    infoColor: '#99e0a5',
    infoColorHover: '#6fd3a6',
  },
  Button: {
    borderRadiusMedium: '12px',
    borderRadiusLarge: '16px',
    fontWeight: '600'
  },
  Input: {
    borderRadius: '12px'
  }
}

</script>