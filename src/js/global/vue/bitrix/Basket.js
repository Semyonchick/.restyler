import axios from 'axios'

export default {
  el: '#basket',
  data: {
    minOrderPrice: 0,

    gifts: [],
    promo: {
      success: false,
      new: true,
      show: false,
      code: '',
      hint: false,
      data: false,
      empty: false
    },
    // minDeliveryPrice: 5000,
    // minPresentPrice: 6000,
    ajaxData: [],
    ajaxParams: [],
    cancelRequest: {}
    // load: 0,
    // error: 0
  },
  watch: {
    items (value, old) {
      if (old && old.length && !value.length) {
        location.reload()
      }
    },
    ajaxData (value) {
      if (value.ERROR_MESSAGE) alert(value.ERROR_MESSAGE)

      this.promo.success = false
      if (value.COUPON) {
        this.promo.code = value.COUPON
        this.promo.show = true
      }
      this.loadGifts()
    }
  },
  methods: {
    removeItem: function (item) {
      let params = {}
      params['DELETE_' + item.ID] = 'Y'
      this.updateCart(params)
    },
    changeItemQuantity: function (item) {
      if (!item.QUANTITY) return false
      else if (+item.QUANTITY > +item.AVAILABLE_QUANTITY) item.QUANTITY = item.AVAILABLE_QUANTITY

      let params = {}
      params['QUANTITY_' + item.ID] = item.QUANTITY
      this.updateCart(params)
    },
    updateCart (params) {
      if (this.cancelRequest['cart']) this.cancelRequest['cart']('repeat')

      let data = new FormData()
      for (let key in this.ajaxParams) data.set(key, this.ajaxParams[key])
      for (let key in params) data.set(key, params[key])

      const CancelToken = axios.CancelToken
      return this.$http.post('/bitrix/components/bitrix/sale.basket.basket/ajax.php', data, {
        cancelToken: new CancelToken((c) => {
          this.cancelRequest.cart = c
        })
      }).then(response => {
        if (response.data){
          this.ajaxData = response.data.BASKET_DATA
          this.promo.success = response.VALID_COUPON
        } else {
          alert('Произошла ошибка!\nПустой ответ сервера.')
        }
        console.log(response)
      }).catch(error => {
        if (axios.isCancel(error)) return console.log('Request canceled', error.message)

        console.error(error)

        this.error++
        if (this.error % 5 === 0) {
          alert('Произошла ошибка!\nНе удалось обновить данные корзины.\n' + error.message)
        } else if (error.status > 499) {
          setTimeout(function () {
            this.updateCart(params)
          }, 500)
        } else {
          alert('Произошла ошибка!\n' + error.message)
        }
      })


      if (this.load) this.load.abort()

      this.load = $.ajax('/bitrix/components/bitrix/sale.basket.basket/ajax.php', {
        method: 'post',
        dataType: 'json',
        data: data
      }).done((resp) => {
        this.ajaxData = resp.BASKET_DATA

        this.$emit('update', 1)

        if (params['coupon']) {
          let couponList = resp.BASKET_DATA.COUPON_LIST.filter(function (row) {
            return row.COUPON === params['coupon']
          }), coupon = couponList[0]
          if (resp.VALID_COUPON) {
            this.promo.success = true
            this.promo.data = coupon
            this.promo.hint = 'Промокод ' + coupon.JS_CHECK_CODE
          } else {
            this.promo.success = false
            this.promo.hint = true
          }

          // setTimeout(function () {
          //     basket.promo.hint = '';
          // }, 3000);
        }
      }).error(() => {
        console.error(error)

        this.error++
        if (this.error % 5 === 0)
          alert('Возникла ошибка с получением данных корзины, пожалуйста, напишите нам об этом на info@fridaywear.ru')
        if (error.status > 499) {
          return setTimeout(function () {
            this.updateCart(params)
          }, 500)
        }
        else alert('Произошла ошибка!\n' + error.message)
      })
    },
    loadGifts: function () {
      // $.ajax('/local/ajax/gifts.php', {
      //   method: 'get',
      //   dataType: 'json'
      // }).done((resp) => {
      //   this.gifts = resp
      // })
    },
    promoInput: function ($event) {
      //this.promo.hint = '';
      if ($event.keyCode === 13) {
        this.checkPromo()
        return false
      }
    },
    checkPromo: function () {
      if (this.promo.code) {
        this.updateCart({coupon: this.promo.code})
      } else {
        this.promo.empty = true
      }
    }
  },
  computed: {
    isGift: function () {
      return this.minPresentPrice < this.total
    },
    freeDelivery: function () {
      return this.minDeliveryPrice < this.total
    },
    items () {
      if (!this.ajaxData.ITEMS) return []
      return this.ajaxData.ITEMS.AnDelCanBuy || this.ajaxData.ITEMS
    },
    discount () {
      return this.ajaxData.DISCOUNT_PRICE_ALL
    },
    total () {
      return this.ajaxData.allSum
    },
    totalWithoutDiscount () {
      return this.ajaxData.PRICE_WITHOUT_DISCOUNT
    },
    totalPrice () {
      return this.ajaxData.allSum_FORMATED
    }
  },
  mounted: function () {
    for (let key in defaultBasketData) this.$set(this, key, defaultBasketData[key])
    console.log(defaultBasketData)
  }
}
