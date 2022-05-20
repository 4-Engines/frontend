// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    defaulTheme: 'light',
    themes: {
      'light': {
        colors: {
          primary: '#1867C0'
        }
      },
    }
  }
})
