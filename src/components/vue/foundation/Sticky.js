export default {
  el: '[data-sticky-container]',
  data: () => ({
    sticky: null,
    start: 0,
    end: 999999,
    width: true,
    top: true,
    active: false
  }),
  methods: {
    update () {
      this.top = window.scrollY + this.sticky.offsetHeight < this.end
      this.active = this.top && window.scrollY > this.start
      if (this.active && this.width !== this.$el.offsetWidth) {
        this.sizes()
      }
    },
    findTop (data) {
      let parse = data.split(':')
      let el = document.getElementById(parse[0])
      let top = el.getBoundingClientRect().top + window.scrollY
      if (parse[1] === 'bottom') top += el.offsetHeight
      return top
    },
    sizes () {
      this.width = this.$el.offsetWidth
      this.start = this.sticky.dataset.topAnchor ? this.findTop(this.sticky.dataset.topAnchor) : 0
      this.end = this.sticky.dataset.btmAnchor ? this.findTop(this.sticky.dataset.btmAnchor) : 999999
      this.$el.style.height = this.sticky.offsetHeight + 'px'
      this.sticky.style.marginTop = (this.top ? this.sticky.dataset.marginTop : 0) + 'em'
      this.sticky.style.maxWidth = this.width + 'px'
      this.sticky.style.bottom = 'auto'
      this.sticky.style.top = this.top ? '0px' : (this.end - this.start - this.sticky.offsetHeight) + 'px'
    }
  },
  watch: {
    active (value) {
      this.sticky.classList.remove('is-anchored', 'is-stuck', 'is-at-top', 'is-at-bottom')
      this.sizes()
      this.sticky.classList.add(value ? 'is-stuck' : 'is-anchored')
      this.sticky.classList.add(this.top ? 'is-at-top' : 'is-at-bottom')
    }
  },
  mounted: function () {
    this.$el.classList.add('sticky-container')
    this.sticky = this.$el.querySelector('[data-sticky]')
    if (!this.sticky) return

    this.sizes()
    this.update()
    window.addEventListener('scroll', this.update)
    window.addEventListener('resize', this.update)
  }
}
