export default {
  el: '[data-tabs]',
  data: () => ({
    content: false,
    options: false,
    active: false
  }),
  methods: {},
  watch: {
    active (value) {
      this.$el.querySelectorAll('.is-active').forEach(el => el.classList.remove('is-active'))
      this.$el.querySelector(value).add('is-active')
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
      event.preventDefault()
      this.active = event.target.href
    })
  }
}
