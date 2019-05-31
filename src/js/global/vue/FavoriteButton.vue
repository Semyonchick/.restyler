<template>
    <div :class="{'is-active':isActive}" @click="add()">
        <ico name="like" width="30" height="28"/>
        <span class="text-info text-left">
            <template v-if="!isActive">
                <span class="button-text-inner">Добавить <br>в избранное</span>
            </template>
            <template v-else>
                <span class="button-text-inner">Смотреть избранное</span>
            </template>
        </span>
    </div>
</template>

<script>
  export default {
    name: 'favorite-button',
    data: () => ({}),
    props: ['itemId'],
    methods: {
      exist () {
      },
      add () {
        if (!this.isActive) this.favoriteList.push(this.itemId)
        else location.href = '/personal/favorite/'
      }
    },
    computed: {
      isActive () {
        return !!(this.favoriteList.indexOf(this.itemId) + 1)
      }
    },
    watch: {},
    created () {
    },
    mounted () {
    }
  }
</script>

<style lang="scss" scoped>

</style>
