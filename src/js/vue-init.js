import Vue from 'vue';

const vueComponents = [];
vueComponents.push({el: '[data-vue]'});

export default () => {
  vueComponents.forEach(component => {
    if (component.el) {
      for (let element of document.querySelectorAll(component.el)) {
        component.el = element;
        element.removeAttribute('data-vue');
        new Vue(component);
      }
    } else {
      new Vue(component);
    }
  });
};