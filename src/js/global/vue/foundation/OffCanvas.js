export default {
  el: '[data-off-canvas]',
  data: () => ({
    isOpen: false,
    direction: '',
    content: null,
    overlay: null
  }),
  methods: {
    open: function () {
      this.isOpen = true
    },
    close: function () {
      this.isOpen = false
    },
    toggle: function () {
      this.isOpen ? this.close() : this.open()
    }
  },
  watch: {
    'isOpen' (data) {
      if (data) {
        this.$el.classList.add('is-open')
        this.content.classList.add('is-open-' + this.direction, 'has-position-' + this.direction, 'has-transition-push')
        this.overlay.classList.add('is-fixed', 'is-visible')
      } else {
        this.$el.classList.remove('is-open')
        this.content.classList.remove('is-open-' + this.direction)
        this.overlay.classList.remove('is-visible')
        this.overlay.addEventListener('transitionend', () => {
          this.overlay.classList.remove('is-fixed')
        }, {once: true})
      }
    }
  },
  mounted: function () {
    let d = ['left', 'right', 'top', 'bottom'].some((direction) => {
      if (this.$el.classList.contains('position-' + direction)) {
        this.direction = direction
        return true
      }
    })

    document.querySelectorAll('[data-open=' + this.$el.id + ']').forEach(element => element.addEventListener('click', this.open))

    this.content = document.querySelector('[data-off-canvas-content]')

    this.overlay = document.createElement('div')
    this.overlay.classList.add('js-off-canvas-overlay', 'is-overlay-absolute', 'is-closable')
    this.overlay = this.content.appendChild(this.overlay)
    this.overlay.addEventListener('click', this.close)
  }
}
