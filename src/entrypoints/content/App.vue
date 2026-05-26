<script setup lang="ts">
import { browser } from "wxt/browser"
import { ref, onMounted, onUnmounted, reactive } from 'vue';
import YouglishIcon from "../../assets/youglish.ico";
import CambridgeIcon from "../../assets/cambridge.ico";
import GoogleIcon from "../../assets/google.ico";

const buttons = [
    {
        tooltip: "YouGlish",
        icon: YouglishIcon,
        getUrl(): URL {
            const value = toSnakeCase(selectedText.value) + "/english/us";
            const url = new URL(value, "https://youglish.com/pronounce/");
return url;
        }
    },
    {
        tooltip: "Cambridge Dictionary",
        icon: CambridgeIcon,
        getUrl(): URL {
            return new URL(selectedText.value, "https://dictionary.cambridge.org/us/dictionary/english/");
        }
    },
    {
        tooltip: "Search on Google",
        icon: GoogleIcon,
        getUrl(): URL {
            const url = new URL("https://www.google.com/search");

            url.searchParams.set("q", selectedText.value)
            return url;
        }
    },
];
const isVisible = ref(false);
const selectedText = ref('');
const menuStyle = reactive({
    top: '0px',
    left: '0px'
});

function toSnakeCase(str: string): string {
    return str
        .trim()                  // Removes leading and trailing spaces
        .toLowerCase()           // Converts to lowercase
        .replace(/\s+/g, '_');   // Replaces one or more spaces with a single underscore
}

function handleMouseUp() {
    const selection = getSelection();

    if (!selection || selection.isCollapsed) {
        isVisible.value = false;
        return;
    }

    const text = selection.toString().trim();
    if (text.length === 0) {
        isVisible.value = false;
        return;
    }

    selectedText.value = text;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    menuStyle.left = `${rect.left + (rect.width / 2)}px`;
    menuStyle.top = `${rect.bottom + 10}px`;
    isVisible.value = true;
};

function debounce(func: (...args: any[]) => void, delay: number) {
    let timeoutID: NodeJS.Timeout;
    return function (...args: any[]) {
        clearTimeout(timeoutID);

        timeoutID = setInterval(() => func.apply(this, args), delay);
    }
}

function handleAction(url: URL) {
    const window: Browser.windows.CreateData = {
        url: url.href,
        focused: true,
        width: 700,
        height: 700,
        type: "popup",
    };

    browser.runtime.sendMessage({
        type: "open_new_window",
        data: window
    });

    isVisible.value = false;
    getSelection()?.empty();
};

onMounted(() => {
    window.addEventListener('mouseup', debounce(handleMouseUp, 200));
});

onUnmounted(() => {
    window.removeEventListener('mouseup', handleMouseUp);
});
</script>

<template>
    <div v-if="isVisible" class="floating-menu" :style="{ top: menuStyle.top, left: menuStyle.left }">
        <button v-for="item in buttons" :title="item.tooltip"  @click="handleAction(item.getUrl())">
            <img :src="item.icon" width="20" height="20">
        </button>
    </div>
</template>


<style scoped>
.floating-menu {
    position: fixed;
    transform: translateX(-50%);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    gap: 4px;
    padding: 6px;
    z-index: 999999;
}
</style>
