// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: 'src',
  // ssr: false,
  typescript: {
    strict: true,
  },
  devtools: { enabled: true },
  ignore: ['**/.direnv', '**/.devenv'],
  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@pinia/nuxt',
    '@nuxt/test-utils/module',
    '@nuxtjs/eslint-module',
  ],
  build: {
    transpile: ['trpc-nuxt'],
  },
  shadcn: { prefix: 'UI', componentDir: 'src/components/ui' },
})
