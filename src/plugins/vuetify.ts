// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    defaulTheme: 'blue',
    themes: {
      'blue': {
        colors: {
          primary: '#1867C0'
        }
      }
    }
  }
})
