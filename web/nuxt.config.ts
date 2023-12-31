// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: 'src',
  typescript: {
    strict: true
  },
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
})
