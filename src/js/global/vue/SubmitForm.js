export default {
  el: '[data-submit]',
  data: self => ({}),
  methods: {},
  mounted () {
    this.$el.addEventListener('submit', (event) => {
      event.preventDefault()

      let form = event.target
      let promise
      if (form.method.toLowerCase() === 'post') {
        promise = this.$http.post(form.action, new FormData(form), {headers: {'X-Requested-With': 'XMLHttpRequest'}})
      } else {
        let url = form.action
        Object.values(new FormData(form)).map(data => console.log(data))
        promise = this.$http.get(form.action, {headers: {'X-Requested-With': 'XMLHttpRequest'}})
      }

      promise.then(request => {
        if (request.data.html) {
          this.$el.innerHTML = request.data.html
          this.$el.innerHTML += '<div class="success message">' + (this.$el.dataset.msg || 'Сообщение успешно отправлено') + '</div>'
          this.$forceUpdate()
        }
        else alert(request.data.error)
      })
    })
  }
}