export default {
  el: '.select-reload',
  data: () => ({
    value: '',
  }),
  methods: {
  },
  watch: {
    value (after, before) {
      after = this.$el.name + '=' + after
      if(before) {
        let search = location.search.replace(new RegExp('[\?\&]'+this.$el.name+'=[^\&\?]*', 'g'), '').replace(/[\?\&]+$/,'').replace('?&','?');
        if(search) {
          location.search = search + '&' + after
        } else {
          location.search = '?' + after
        }
      }

      console.log(before, after)
    }
  },
  computed: {},
  mounted () {
  }
}
