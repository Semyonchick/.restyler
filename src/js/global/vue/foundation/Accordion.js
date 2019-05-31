export default {
  el: '[data-accordion-item]',
  data: () => ({
    content: false,
    options: false,
    active: false
  }),
  methods: {},
  watch: {
    active (value) {
      if (value) {
        this.$el.classList.add('is-active')
        this.content.style.display = 'block'
      } else {
        this.$el.classList.remove('is-active')
        this.content.style.display = 'none'
      }
    }
  },
  computed: {
    multi () {
      return this.options.multiExpand === 'true'
    }
  },
  mounted: function () {
    let accordion = this.$el.parentNode
    this.content = this.$el.querySelector('.accordion-content')
    this.options = accordion.dataset
    this.$el.querySelector('a').addEventListener('click', event => {
      this.active = !this.active
    })
  }
}
