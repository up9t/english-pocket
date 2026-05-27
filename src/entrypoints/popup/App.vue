<script lang="ts" setup>
import { mdiGithub, mdiInformationOutline } from '@mdi/js';

const isAutoHideSelection = ref<boolean>(true);
const githubLink = "https://github.com/up9t/english-pocket";
const kofiDonationLink = "https://ko-fi.com/P6Q320A43K"

watch(isAutoHideSelection, async (newValue) => {
  await storage.setItem("local:is_auto_hide_selection", newValue)
    .catch(console.error);
});

onMounted(async () => {
  console.log(storage);
  if (storage) {
    const result = await storage.getItem('local:is_auto_hide_selection', {
      defaultValue: isAutoHideSelection.value,
    }) as boolean;

    isAutoHideSelection.value = result;
  }
})
</script>

<template>
  <header>
    <h1 class="text-headline-large">English Pocket</h1>
  </header>
  <v-divider :thickness="3"></v-divider>
  <main>
    <v-switch v-model="isAutoHideSelection" color="primary" label="Auto hide selection"></v-switch>
  </main>
  <v-divider :thickness="3"></v-divider>
  <footer>
    <v-btn :href="githubLink" :prependIcon="mdiGithub">Github</v-btn>
    <v-btn :href='kofiDonationLink' target='_blank'><img height='36' style='border:0px;height:36px;'
        src='https://storage.ko-fi.com/cdn/kofi2.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' /></v-btn>
  </footer>
</template>

<style scoped></style>
