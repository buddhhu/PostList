<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { usePostStore } from '../stores/postStore'

const postStore = usePostStore()

const searchInput = ref("")

const filteredPosts = computed(() => {
    const query = searchInput.value.trim().toLowerCase()
    if (!query) {
        return postStore.posts
    }
    return postStore.posts.filter(post =>
        post.title.toLowerCase().includes(query)
    )
})

const loadPosts = async () => {
    await postStore.fetchPostsApi()
}

onMounted(() => {
    setTimeout(async () => await loadPosts(), 3000)
})
</script>


<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div class="max-w-5xl mx-auto">
            <transition name="fade">
                <div v-if="!postStore.fetched" class="text-center text-xl font-semibold text-gray-600 py-20">
                    Loading posts...
                </div>
            </transition>

            <transition name="fade">
                <div v-if="postStore.fetchError" class="text-center text-red-600 py-10">
                    <p class="mb-4 text-2xl font-semibold">Something Went Wrong 🥲</p>
                    <button @click="loadPosts"
                        class="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition">
                        Retry
                    </button>
                </div>
            </transition>

            <div v-if="postStore.fetched && !postStore.fetchError">
                <h1 class="text-4xl font-extrabold text-center text-indigo-800 mb-10">📚 Browse Posts</h1>

                <transition name="fade">
                    <form v-if="postStore.posts.length" @submit.prevent
                        class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                        <input type="text" v-model="searchInput" aria-label="Search posts" placeholder="Type a title..."
                            class="w-full sm:w-2/3 px-5 py-3 rounded-lg border border-gray-300 shadow focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                    </form>
                </transition>

                <div v-if="searchInput" class="mb-4 text-center text-gray-700 text-sm">
                    Found <span class="font-semibold">{{ filteredPosts.length }}</span>
                    of {{ postStore.posts.length }} matching '<span class="italic">{{ searchInput }}</span>'
                </div>

                <p v-if="filteredPosts.length === 0" class="text-center text-gray-500 mb-8">
                    No posts match your search.
                </p>

                <transition-group name="fade" tag="ul" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <li v-for="post in filteredPosts" :key="post.id"
                        class="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6 flex flex-col justify-between">
                        <div>
                            <h2 class="text-lg font-semibold text-indigo-700 mb-2">{{ post.title }}</h2>
                            <p class="text-gray-700 text-sm">{{ post.body }}</p>
                        </div>
                        <div class="mt-4 text-xs text-gray-400">
                            Post ID: {{ post.id }} &nbsp|&nbsp User ID: {{ post.userId }}
                        </div>
                    </li>
                </transition-group>
            </div>
        </div>
    </div>
</template>


<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: all 0.4s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(10px);
}
</style>