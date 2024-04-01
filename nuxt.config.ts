// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: 'src/',
  typescript: {
    strict: true,
  },
  devtools: { enabled: true },
  ignore: ['**/.direnv', '**/.devenv'],
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@nuxt/test-utils/module',
    '@nuxtjs/eslint-module',
  ],
  build: {
    transpile: ['trpc-nuxt'],
  },
})
