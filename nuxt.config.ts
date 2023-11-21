// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    "@nuxt/ui",
    '@nuxtjs/google-fonts',
    "@nuxtjs/supabase",
    "nuxt-icon",
  ],

  supabase : {
    redirect: false
  },

  googleFonts: {
    families: {
      'Rowdies' : [500, 700]
    }
  },

  ui : {
    icons: ['heroicons', 'mingcute']
  },

  ssr: false
})
