<script lang="ts" setup>
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "../../components/ui/button-group/index.ts";

const isAutoHideSelection = ref<boolean>(true);
const githubLink = "https://github.com/up9t/english-pocket";
const kofiDonationLink = "https://ko-fi.com/up9t99 ";

watch(isAutoHideSelection, async (newValue) => {
  await storage.setItem("local:is_auto_hide_selection", newValue).catch(console.error);
});

onMounted(async () => {
  console.log(storage);
  if (storage) {
    const result = (await storage.getItem("local:is_auto_hide_selection", {
      defaultValue: isAutoHideSelection.value,
    })) as boolean;

    isAutoHideSelection.value = result;
  }
});
</script>

<template>
  <div class="p-6 flex flex-col gap-6">
    <header>
      <h1 class="text-4xl">English Pocket</h1>
    </header>
    <main>
      <div class="flex items-center gap-4">
        <Switch v-model="isAutoHideSelection" id="auto-hide" />
        <Label for="auto-hide">Auto hide selection</Label>
      </div>
    </main>
    <footer>
      <ButtonGroup class="flex gap-4">
        <Button asChild>
          <a :href="githubLink">Github</a>
        </Button>
        <Button asChild>
          <a :href="kofiDonationLink" target="_blank">
            <img
              height="36"
              style="border: 0px; height: 36px"
              src="https://storage.ko-fi.com/cdn/kofi2.png?v=6"
              border="0"
              alt="Buy Me a Coffee at ko-fi.com"
            />
          </a>
        </Button>
      </ButtonGroup>
    </footer>
  </div>
</template>

<style scoped></style>
