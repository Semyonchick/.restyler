import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

import vueComponents from './components'

Vue.use(VueAxios, axios.create({
  baseURL: 'http://promgo.rere/'
}))

document.addEventListener('DOMContentLoaded', function () {
  vueComponents.forEach(component => {
    if (component.el) {
      let elements = document.querySelectorAll(component.el)
      if (elements.length) {
        elements.forEach(element => {
          component.el = element
          new Vue(component)
        })
      }
      return
    }
    new Vue(component)
  })
})