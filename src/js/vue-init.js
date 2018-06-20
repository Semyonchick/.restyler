import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

const vueComponents = []

Vue.use(VueAxios, axios.create({
  baseURL: ''
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