<script setup lang="ts">
import { browser } from "wxt/browser";
import { ref, onMounted, onUnmounted, reactive } from "vue";
import YouglishIcon from "../../assets/youglish.png";
import CambridgeIcon from "../../assets/cambridge.ico";
import GoogleIcon from "../../assets/google.ico";
import MerriamIcon from "../../assets/merriam.ico";
import DictionaryIcon from "../../assets/dictionary.ico";
import ThesaurusIcon from "../../assets/thesaurus.ico";
import VocabularyIcon from "../../assets/vocabulary.png";
import CollinsIcon from "../../assets/collins.png";
import { ButtonGroup } from "../../components/ui/button-group";
import { Button } from "../../components/ui/button";
import { TooltipProvider } from "../../components/ui/tooltip";
import { Tooltip } from "../../components/ui/tooltip";
import { TooltipTrigger } from "../../components/ui/tooltip";
import { TooltipContent } from "../../components/ui/tooltip";

const buttons = [
  {
    tooltip: "Dictionary.com",
    icon: DictionaryIcon,
    getUrl(): URL {
      const url = new URL(toKebabCase(selectedText.value), "https://www.dictionary.com/browse/");
      return url;
    },
  },
  {
    tooltip: "Thesaurus.com",
    icon: ThesaurusIcon,
    getUrl(): URL {
      const url = new URL(toKebabCase(selectedText.value), "https://www.thesaurus.com/browse/");
      return url;
    },
  },
  {
    tooltip: "Vocabulary.com",
    icon: VocabularyIcon,
    getUrl(): URL {
      const url = new URL(
        trimAllSpace(selectedText.value).toLowerCase(),
        "https://www.vocabulary.com/dictionary/",
      );
      return url;
    },
  },
  {
    tooltip: "Merriam Webster",
    icon: MerriamIcon,
    getUrl(): URL {
      const url = new URL(
        trimAllSpace(selectedText.value).toLowerCase(),
        "https://www.merriam-webster.com/dictionary/",
      );
      return url;
    },
  },
  {
    tooltip: "YouGlish",
    icon: YouglishIcon,
    getUrl(): URL {
      const value = toSnakeCase(selectedText.value) + "/english/us";
      const url = new URL(value, "https://youglish.com/pronounce/");
      return url;
    },
  },
  {
    tooltip: "Cambridge Dictionary",
    icon: CambridgeIcon,
    getUrl(): URL {
      return new URL(selectedText.value, "https://dictionary.cambridge.org/us/dictionary/english/");
    },
  },
  {
    tooltip: "Collins Dictionary",
    icon: CollinsIcon,
    getUrl(): URL {
      const value = toKebabCase(selectedText.value);
      return new URL(value, "https://www.collinsdictionary.com/us/dictionary/english/");
    },
  },
  {
    tooltip: "Search on Google",
    icon: GoogleIcon,
    getUrl(): URL {
      const url = new URL("https://www.google.com/search");

      url.searchParams.set("q", selectedText.value);
      return url;
    },
  },
];
const menuElement = ref<HTMLElement | null>(null);
const isVisible = ref(false);
const selectedText = ref("");
const menuStyle = reactive({
  top: "0px",
  left: "0px",
});

function toKebabCase(str: string): string {
  return str.trim().toLowerCase().replace(/\s+/g, "-");
}

function toSnakeCase(str: string): string {
  return str
    .trim() // Removes leading and trailing spaces
    .toLowerCase() // Converts to lowercase
    .replace(/\s+/g, "_"); // Replaces one or more spaces with a single underscore
}

function trimAllSpace(str: string): string {
  return str.trim().replace(/\s+/g, " ");
}

function getTextSelection(): [string, Selection | null] {
  const selection = getSelection();

  if (selection === null || selection.isCollapsed) {
    return ["", null];
  }

  const text = selection.toString().trim();

  return [text, selection];
}

function showMenu(selection: Selection) {
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  menuStyle.left = `${rect.left + rect.width / 2}px`;
  menuStyle.top = `${rect.bottom + 10}px`;
  isVisible.value = true;
}

let timeoutID: ReturnType<typeof setTimeout>;

function handleGlobalMouseUp() {
  const delay = 200;

  clearTimeout(timeoutID);
  timeoutID = setTimeout(() => {
    const [text, selection] = getTextSelection();

    if (text.length === 0 || selection === null) {
      isVisible.value = false;
      return;
    }

    selectedText.value = text;

    showMenu(selection);
  }, delay);
}

function handleGlobalMouseDown() {
  clearTimeout(timeoutID);
  isVisible.value = false;
}

function handleMouseDown(e: MouseEvent) {
  e.stopPropagation();
}
function handleMouseUp(e: MouseEvent) {
  e.stopPropagation();
}
async function handleAction(url: URL) {
  const window: Browser.windows.CreateData = {
    url: url.href,
    focused: true,
    width: 700,
    height: 700,
    type: "popup",
  };

  await browser.runtime
    .sendMessage({
      type: "open_new_window",
      data: window,
    })
    .catch(console.error);

  const isAutoHideSelection = await storage
    .getItem("local:is_auto_hide_selection", {
      defaultValue: true,
    })
    .catch((err) => err);

  if (isAutoHideSelection instanceof Error) {
    console.error(isAutoHideSelection);
    return;
  }

  if (isAutoHideSelection) {
    isVisible.value = false;
    getSelection()?.empty();
  }
}

onMounted(() => {
  window.addEventListener("mouseup", handleGlobalMouseUp);
  window.addEventListener("mousedown", handleGlobalMouseDown);
});

onUnmounted(() => {
  window.removeEventListener("mouseup", handleGlobalMouseUp);
  window.removeEventListener("mousedown", handleGlobalMouseDown);
});
</script>

<template>
  <div
    ref="menuElement"
    v-show="isVisible"
    class="z-99999 floating-menu"
    :style="{ top: menuStyle.top, left: menuStyle.left }"
    @mouseup="handleMouseUp"
    @mousedown="handleMouseDown"
  >
    <ButtonGroup>
      <template v-for="(item, index) in buttons" :key="index">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button variant="outline" size="icon" @click="handleAction(item.getUrl())">
                <img :src="item.icon" alt="Icon" class="h-6 object-cover" />
              </Button>
            </TooltipTrigger>
            <TooltipContent :container="menuElement || undefined">
              <p>{{ item.tooltip }}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </template>
    </ButtonGroup>
  </div>
</template>

<style scoped>
.floating-menu {
  position: fixed;
  transform: translateX(-50%);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  background-color: snow;
  gap: 4px;
  padding: 6px;
  z-index: 999999;
}
</style>
