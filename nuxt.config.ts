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
  runtimeConfig: {
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    databaseUrl: process.env.DATABASE_URL,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
})
