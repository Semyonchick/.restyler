import vueSlider from 'vue-slider-component'

export default {
  el: '.filter',
  components: {
    vueSlider
  },
  data: () => ({
    filter: {},
    openList: []
  }),
  methods: {
    toggle (id) {
      this.opened(id) ? this.openList.splice(this.opened(id) - 1, 1) : this.openList.push(id)
    },
    opened (id) {
      return this.openList.indexOf(id) + 1
    },
    submit () {

    }
  },
  watch: {},
  computed: {},
  mounted: function () {
    let preload = this.$el.dataset.values
    if (preload){
      preload = JSON.parse(preload)
      Object.keys(preload).forEach(value => {
        this.$set(this, value, preload[value])
      })
    }
    console.log(this.openList)
  }
}
