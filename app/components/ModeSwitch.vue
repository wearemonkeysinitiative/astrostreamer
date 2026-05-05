<script setup lang="ts">
const { mode, isManual, setMode, resetToAuto } = useMode()

const isAstro = computed({
  get: () => mode.value === 'astro',
  set: (val: boolean) => setMode(val ? 'astro' : 'chill')
})
</script>

<template>
  <div class="flex items-center gap-2">
    <UIcon name="i-lucide-sun" class="size-4 text-neutral-400" />
    <USwitch
      v-model="isAstro"
      unchecked-icon="i-lucide-sun"
      checked-icon="i-lucide-moon"
    />
    <UIcon name="i-lucide-moon" class="size-4 text-neutral-400" />

    <UButton
      v-if="isManual"
      variant="ghost"
      size="xs"
      icon="i-lucide-rotate-ccw"
      title="Авто"
      @click="resetToAuto"
    />
  </div>
</template>
