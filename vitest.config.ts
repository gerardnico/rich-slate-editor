import {defineConfig} from 'vitest/config'
import path from "node:path";


// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    test: {
        environment: 'jsdom',
        globals: true, // for jest expect global used by testing library
        setupFiles: './__test__/setup.ts',
    }
})
