import { defineStore } from "pinia"
import type { PostType } from "../types/postType"

export const usePostStore = defineStore('post', {
    state: () => ({
        posts: [] as PostType[],
        fetched: false,
        fetchError: false
    }),
    actions: {
        async fetchPostsApi(): Promise<void> {
            this.fetched = false
            this.fetchError = false
            try {
                const response = await fetch('https://jsonplaceholder.typicode.com/posts')
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                this.posts = (await response.json()) as PostType[]
            } catch (e) {
                console.error("Failed to fetch posts:", e)
                this.fetchError = true
            } finally {
                this.fetched = true
            }
        }
    }
})
