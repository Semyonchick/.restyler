export default {
  el: '[data-responsive-accordion-tabs]',
  data: () => ({
    type: false,
    content: false,
    options: {},
    classes: {
      li: {
        tabs: 'tabs-title',
        accordion: 'accordion-item'
      },
      a: {
        tabs: '',
        accordion: 'accordion-title'
      }
    },
    active: false
  }),
  methods: {
    resize () {
      this.type = this.options[this.size()] || this.options.default
    },
    size () {
      if (window.innerWidth < 640) return 'small'
      else if (window.innerWidth < 1024) return 'medium'
      else return 'large'
    }
  },
  watch: {
    active (value) {
      this.$el.querySelectorAll('.is-active').forEach(el => el.classList.remove('is-active'))
      value.parentNode.classList.add('is-active')

      if (this.content.querySelector('.is-active'))
        this.content.querySelector('.is-active').classList.remove('is-active')

      document.querySelector(value.getAttribute('href')).classList.add('is-active')
    },
    type (value) {
      this.$el.classList.remove('tabs', 'accordion')
      this.$el.classList.add(value)

      this.$el.querySelectorAll('a').forEach(el => {
        let container = this.type === 'accordion' ? el.parentNode : this.content
        container.append(document.querySelector(el.getAttribute('href')))
      })

      for (let tag in this.classes) {
        this.$el.querySelectorAll(tag).forEach(el => {
          Object.values(this.classes[tag]).forEach(name => {
            if (name) el.classList.remove(name)
          })
          if (this.classes[tag][this.type]) el.classList.add(this.classes[tag][this.type])
        })
      }
    }
  },
  computed: {
    multi () {
      return this.options.multiExpand === 'true'
    }
  },
  mounted: function () {
    this.content = document.querySelector('[data-tabs-content="' + this.$el.id + '"]')

    this.$el.dataset.responsiveAccordionTabs.split(' ').forEach(name => {
      let data = name.split('-')
      if (data[1]) this.options[data[0]] = data[1]
      else this.options['default'] = data[0]
    })
    this.type = this.options.default

    this.$el.querySelectorAll('a').forEach(el => {
      el.addEventListener('click', event => {
        event.preventDefault()
        this.active = event.target
      })
    })
    window.addEventListener('resize', this.resize)
    this.resize()
  }
}
