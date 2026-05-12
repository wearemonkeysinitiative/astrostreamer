<template>
  <div class="min-h-screen flex flex-col" style="background: var(--bg-0)">
    <AppHeader />
    <main class="flex-1 flex flex-col">
      <slot />
    </main>
  </div>
</template>
