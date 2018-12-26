<template>
    <div>
        <div class="counter">
            <input type="text" class="counter-input" name="quantity" v-model="value"
                   :min="min" :max="max" autocomplete="off">
            <button type="button" class="counter-button button plus" @click="$emit('input', value+1)">&plus;</button>
            <button type="button" class="counter-button button minus" @click="$emit('input', value-1)">&minus;</button>
        </div>
        <slot></slot>
    </div>
</template>

<script>
  export default {
    name: 'product-quantity',
    data: () => ({

    }),
    props: {
      value: {default: 1},
      max: {},
      min: {default: 1}
    },
    methods: {},
    computed: {},
    watch: {
      value (value, old) {
        if (value !== '') {
          let newValue = parseInt(value) || 0
          if (newValue < (this.min)) newValue = this.min
          else if (this.max && newValue > this.max) newValue = this.max
          if (newValue !== value) this.$emit('input', newValue)
        }
      }
    },
    created () {
    },
    mounted () {
    }
  }
</script>

<style lang="scss" scoped>

</style>
