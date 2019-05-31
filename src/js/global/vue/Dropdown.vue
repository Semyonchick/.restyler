<template>
    <div class="dropdown" :class="{'is-open': isOpen}" :disabled="disabled">
        <div class="dropdown-toggle" @click="toggle()">
            <slot name="toggle"></slot>
        </div>
        <div v-if="isOpen" class="dropdown-content">
            <slot></slot>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'dropdown',
    data: () => ({
      isOpen: false
    }),
    props: {
      onClick: { type: Boolean, default: _ => true },
      trigger: {},
      disabled: { type: Boolean, default: _ => false }
    },
    methods: {
      open () {
        if (!this.disabled) this.isOpen = true
      },
      close () {
        this.isOpen = false
      },
      toggle () {
        if (!this.disabled) this.isOpen = !this.isOpen
      }
    },
    computed: {},
    watch: {
      trigger (value) {
        if (value) this.open()
        else this.close()
      },
      isOpen (newVal) {
        if (newVal) this.$emit('open', {target: this})
        else this.$emit('close', {target: this})
      }
    },
    created () {
      this.$on('open', this.open)
      this.$on('close', this.close)
      this.$on('toggle', this.toggle)
    },
    mounted () {
      if(this.onClick) document.addEventListener('click', _ => {
        if (this.isOpen && !this.$el.contains(event.target)) this.isOpen = false
      })
    }
  }
</script>

<style lang="scss" scoped>
    @import "~foundation-sites/scss/util/util";

    .dropdown {
        position: relative;
        &.top {
            .dropdown-content {
                top: auto;
                bottom: 100%;
                left: 0;
                right: auto;
            }
        }
        &.bottom {
            .dropdown-content {
                top: 100%;
                bottom: auto;
                left: 0;
                right: auto;
            }
        }
        &.left {
            .dropdown-content {
                top: 0;
                bottom: auto;
                left: auto;
                right: 100%;
            }
        }
        &.right {
            .dropdown-content {
                top: 0;
                bottom: auto;
                left: 100%;
                right: auto;
            }
        }
        &.full {
            .dropdown-toggle {
                display: block;
            }
        }
    }

    .dropdown-toggle {
        display: inline-block;
    }

    .dropdown-content {
        position: absolute;
        top: 100%;
        bottom: auto;
        z-index: 1;
    }

</style>
