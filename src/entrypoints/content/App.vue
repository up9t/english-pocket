<script setup lang="ts">
import { browser } from "wxt/browser"
import { ref, onMounted, onUnmounted, reactive } from 'vue';
import YouglishIcon from "../../assets/youglish.ico";
import CambridgeIcon from "../../assets/cambridge.ico";
import GoogleIcon from "../../assets/google.ico";
import MerriamIcon from "../../assets/merriam.ico";
import DictionaryIcon from "../../assets/dictionary.ico";
import ThesaurusIcon from "../../assets/thesaurus.ico";
import VocabularyIcon from "../../assets/vocabulary.png";

const buttons = [
    {
        tooltip: "Dictionary.com",
        icon: DictionaryIcon,
        getUrl(): URL {
            const url = new URL(toKebabCase(selectedText.value), "https://www.dictionary.com/browse/");
            return url;
        }
    },
    {
        tooltip: "Thesaurus.com",
        icon: ThesaurusIcon,
        getUrl(): URL {
            const url = new URL(toKebabCase(selectedText.value), "https://www.thesaurus.com/browse/");
            return url;
        }
    },
    {
        tooltip: "Vocabulary.com",
        icon: VocabularyIcon,
        getUrl(): URL {
            const url = new URL(trimAllSpace(selectedText.value).toLowerCase(), "https://www.vocabulary.com/dictionary/");
            return url;
        }
    },
    {
        tooltip: "Merriam Webster",
        icon: MerriamIcon,
        getUrl(): URL {
            const url = new URL(trimAllSpace(selectedText.value).toLowerCase(), "https://www.merriam-webster.com/dictionary/");
            return url;
        }
    },
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

function toKebabCase(str: string): string {
    return str
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-');
}

function toSnakeCase(str: string): string {
    return str
        .trim()                  // Removes leading and trailing spaces
        .toLowerCase()           // Converts to lowercase
        .replace(/\s+/g, '_');   // Replaces one or more spaces with a single underscore
}

function trimAllSpace(str: string): string {
    return str
        .trim()
        .replace(/\s+/g, ' ');
}

function handleMouseUp() {
    console.log("is it up");
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

async function handleAction(url: URL) {
    const window: Browser.windows.CreateData = {
        url: url.href,
        focused: true,
        width: 700,
        height: 700,
        type: "popup",
    };

    await browser.runtime.sendMessage({
        type: "open_new_window",
        data: window
    }).catch(console.error);

    isVisible.value = false;

    const isAutoHideSelection = await storage.getItem("local:is_auto_hide_selection", {
        defaultValue: true,
    }).catch(err => err);

    if (isAutoHideSelection instanceof Error) {
        console.error(isAutoHideSelection);
        return;
    }

    if (isAutoHideSelection) {
        getSelection()?.empty();
    }
};

onMounted(() => {
    window.addEventListener('mouseup', debounce(handleMouseUp, 200));
});

onUnmounted(() => {
    window.removeEventListener('mouseup', handleMouseUp);
});
</script>

<template>
    <div id="english-pocket-container" v-if="isVisible" class="floating-menu" :style="{ top: menuStyle.top, left: menuStyle.left }">
        <v-tooltip v-for="(item, index) in buttons" :key="index" :text="item.tooltip" location="bottom">
            <template #activator="{ props }">
                <v-btn v-bind="props" icon variant="tonal" density="comfortable" @click="handleAction(item.getUrl())">
                    <v-img :src="item.icon" width="24" height="24" />
                </v-btn>
            </template>
        </v-tooltip>
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
