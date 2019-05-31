export default {
  el: '#order',
  data: {
    ajaxParams: {},
    isAuth: false,
    properties: [],
    deliveries: [],
    payments: [],
    total: [],
    data: {},
    city: '',
    autocomplete: {},

    user: false,

    addressList: false,
    email: '',
    password: '',
    deliveryMethods: {},
    paymentMethods: [],
    showPassword: false,
    errorPassword: false,
    deliveryError: false,
    postDeliveryPrice: false,
    previousRequest: false,
  },
  methods: {
    loadData: function (data) {
      if(data.IS_AUTHORIZED) this.isAuth = data.IS_AUTHORIZED;
      if(!data.ORDER_PROP) return;
      this.properties = data.ORDER_PROP.properties;
      this.deliveries = Object.keys(data.DELIVERY).map(function (e) {
        return data.DELIVERY[e]
      }).sort(function (a, b) {
        return a['SORT'] - b['SORT'];
      });
      this.payments = data.PAY_SYSTEM;
      this.total = data.TOTAL;

      var changedProperties = [];
      for(var i in this.properties) {
        this.properties[i].CODE = 'ORDER_PROP_' + this.properties[i].ID;
        if(!this.data[this.properties[i].CODE]) {
          this.data[this.properties[i].CODE] = this.properties[i].VALUE[0].replace(/<.+>/, '') || this.properties[i].DEFAULT_VALUE;
          if (this.data[this.properties[i].CODE])
            changedProperties.push(this.properties[i]);
        }
      }

      for(var i in this.deliveries) {
        if (this.deliveries[i].CHECKED === 'Y') {
          this.data[this.deliveries[i].FIELD_NAME] = this.deliveries[i].ID;
        }
      }

      for(var i in this.payments) {
        if (!this.payments[i].FIELD_NAME) this.payments[i]['FIELD_NAME'] = 'PAY_SYSTEM_ID';
        if (this.payments[i].CHECKED === 'Y') {
          this.data[this.payments[i].FIELD_NAME] = this.payments[i].ID;
        }
      }

      if (changedProperties.length) this.updateCity();
    },
    updateCity: function () {
      var cityProperties = this.properties.filter(function (row) {
        return row.TYPE === 'LOCATION';
      });
      if (cityProperties.length) {
        var cityProperty = cityProperties[0];
        var cityId = this.data[cityProperty.CODE];

        if (cityId) {
          this.searchLocation(cityId).done(function (resp) {
            resp = order.normalizeLocations(resp);
            order.city = resp[0].label;
          });
        }
      }
    },
    send: function () {
      var data = Object.assign({}, this.ajaxParams);
      data['order'] = {
        sessid: data['sessid'],
        'soa-action': data['soa-action'],
        location_type: data.location_type,
        BUYER_STORE: 0,
        PERSON_TYPE: 1,
        PROFILE_ID: 0,
        RECENT_DELIVERY_VALUE: 0
      };
      if (this.email) this.data['ORDER_PROP_2'] = this.email;

      for (var i in this.data){
        data[i] = data['order'][i] = this.data[i];
      }
      if (this.load) this.load.abort();
      return this.load = $.ajax('/bitrix/components/bitrix/sale.order.ajax/ajax.php', {
        method: 'post',
        dataType: 'json',
        data: data
      }).done(function (resp) {
        if (!resp.order) {
          return false;
        } else if (resp.order.ERROR && resp.order.ERROR.PROPERTY) {
          var message = 'Заполнены не все поля';
          resp.order.ERROR.PROPERTY.forEach(function (value) {
            message += '\n' + value;
          });
          alert(message);
        }
        else if (resp.order.REDIRECT_URL) location.href = resp.order.REDIRECT_URL;
        else order.loadData(resp.order);
      }).error(function (error) {
        console.error(error);
        if (error.status > 499) order.send();
      });
    },
    searchLocation: function (q) {
      if (q.length < 2) return;
      var data = {
        select: {'VALUE': 'CODE', 'DISPLAY': 'NAME.NAME'},
        additionals: {1: 'PATH'},
        filter: {
          '=TYPE_ID': 5,
          '=NAME.LANGUAGE_ID': 'ru',
          '=SITE_ID': this.ajaxParams['SITE_ID']
        },
        version: 2,
        PAGE_SIZE: 10,
        PAGE: 0
      };
      data.filter[parseInt(q) == q ? '=CODE' : '=PHRASE'] = q;
      return $.ajax('/bitrix/components/bitrix/sale.location.selector.search/get.php', {
        method: 'post',
        dataType: 'html',
        cache: true,
        data: data
      }).error(function (resp) {
        console.error(resp);
        if (resp.status > 499) order.searchLocation();
      });
    },
    normalizeLocations: function (resp) {
      resp = JSON.parse(resp.replace(/\'/g, '"')).data;
      return resp ? resp.ITEMS.map(function (row) {
        return {
          'id': row.VALUE,
          // 'value': row.DISPLAY,
          'label': row.DISPLAY + ', ' + row.PATH.map(function (value) {
            return resp.ETC.PATH_ITEMS[value].DISPLAY;
          }).join(', ')
        };
      }) : [];
    },
    currentCity: function () {
      if (!this.data['ORDER_PROP_6'])
        $.ajax({
          url: "https://ru.sxgeo.city/jsonp/",
          dataType: "jsonp",
          cache: true,
          success: function (data) {
            order.searchLocation([data.city.name_ru].join(' ')).done(function (resp) {
              resp = order.normalizeLocations(resp);
              if (resp.length > 1) {
                var resp2 = resp.filter(function (row) {
                  return row.label.indexOf(data.region.name_ru);
                });
                if (resp2.length) resp = resp2;
              }
              if (resp.length) {
                var cityData = resp.pop();
                if (!order.data['ORDER_PROP_6'] && order.data['ORDER_PROP_6'] !== cityData.id) {
                  order.data['ORDER_PROP_6'] = cityData.id;
                  order.city = cityData.label;
                  order.send();
                }
              }
            });
          }
        });
    },
    submit: function () {
      this.$validator.validateAll().then(function (result) {
        if (result) {
          document.body.classList.add('loading');
          order.ajaxParams['soa-action'] = 'saveOrderAjax';
          order.send().done(function (resp) {
            document.body.classList.remove('loading');
            order.ajaxParams['soa-action'] = 'refreshOrderAjax';
          });
        }

        $('.is-invalid-input').focus()
      });
    },
    $autoCity: function (id) {
      Vue.nextTick(function () {
        $(function () {
          $('#' + id).autocomplete({
            source: function (request, response) {
              order.searchLocation(request.term).done(function (resp) {
                resp = order.normalizeLocations(resp);
                if (resp.length) response(resp);
              });
            },
            select: function (event, ui) {
              order.data[id] = ui.item.id;
              order.data['ORDER_PROP_4'] = '';
              order.city = ui.item.label;
              order.send();
            },
            minLength: 1
          });
        });
      });
    },
    $addMask: function () {
      if (Foundation.MediaQuery.is('medium'))
        Vue.nextTick(function () {
          var element = document.getElementById('ORDER_PROP_3');
          if (element && !element.dataset.mask) {
            element.dataset.mask = 1;
            var im = new Inputmask("+7 (999) 9999999");
            im.mask(element);
            element.oninput = function () {
              order.data[this.name] = this.value;
            };
          }
        });
    },

    getUser: function () {
    },
    login: function () {
      /*if (!order.email) {
          this.$validator.validateAll('email').then(function(result){
              console.log(result)
          });
          return false;
      }*/
      this.$validator.validateAll(['email']).then(function (result) {
        if (result) {
          var params;
          params = order.password ? {
            USER_LOGIN: order.email,
            USER_PASSWORD: order.password
          } : {USER_EXIST: order.email};

          if (order['userValidate']) order['userValidate'].abort();
          order['userValidate'] = $.ajax('/auth/validate.php', {
            method: 'POST',
            dataType: 'json',
            data: params,
          }).done(function (resp) {
            order.errorPassword = false;

            if (resp === true) {
              if (params.USER_PASSWORD) {
                order.isAuth = true;
                order.showPassword = false;
                order.send();
              } else{
                order.showPassword = true;
              }
            } else {
              if (params.USER_PASSWORD) {
                order.errorPassword = true;
              } else {
                order.isAuth = true;
                order.showPassword = false;
              }
            }
          });
        }
      });

      /*this.$validator.validateAll().then(function () {
          if (!order.data.email) {
              return false;
          }
          var params = {};
          params['email'] = order.data.email;
          if (order.password) {
              params['password'] = order.password;
          }
          $.ajax('/ajax/user', {
              method: 'POST',
              dataType: 'json',
              data: params,
          }).done(function (resp) {
              if (resp.error) {
                  if (order.data.email) {
                      order.user = {email: order.data.email};
                      order.autoCity();
                      order.currentCity();
                  }
                  if (order.password) {
                      order.errorPassword = true;
                  }
              } else {
                  if (order.data.email) {
                      order.showPassword = true;
                  }
                  if (order.password) {
                      order.errorPassword = order.showPassword = false;
                      order.user = resp.user;
                      order.getAddress();
                  }
              }
              order.addMask();
          });
      });*/
    },
    clearAddress: function () {
      for (var item in order.data) {
        order.data[item] = '';
      }
    },
    getAddress: function () {
      /*$.ajax('/ajax/address', {
          dataType: 'json',
      }).done(function (resp) {
          if (!resp.error) {
              order.addressList = resp.message;
              order.setAddress();
          } else order.currentCity();
      });
      order.addMask();*/
    },
    setAddress: function (id) {
      /*if (!order.addressList.length) {
          order.currentCity();
          return;
      }
      if (id === 'new') {
          order.clearAddress();
          order.currentCity();
          return;
      }
      if (!id) id = order.addressList[0].id;
      var address = order.addressList.filter(function () {
          return address.id == id
      })[0];
      for (var item in order.data) {
          if (item === 'phone') address[item] = address[item].replace(/[^\d]+/g, '').replace(/^(7|8)/, '');
          if (address[item]) order.data[item] = address[item];
      }
      order.data.address_id = id;
      order.data['index'] = address ? address['postalCode'] : '';
      Vue.nextTick(function () {
          return order.autoCity()
      });*/
    },
  },
  computed: {
    submitButtonText: function () {
      var id = this.data.PAY_SYSTEM_ID;
      return this.payments.filter(function (row) {
        return row.ID === id;
      }).pop().IS_CASH === 'Y' ? 'Оформить' : 'Оформить и перейти к оплате';
    }
  },
  mounted: function () {
    this.loadData(data);
    this.ajaxParams = ajaxParams;

    var element = document.getElementById('wrapper-load');
    if(element) element.classList.remove('show');

    this.currentCity();

    if(window['basket']) basket.$on('update', function (id) {
      order.send();
    });
  }
}
