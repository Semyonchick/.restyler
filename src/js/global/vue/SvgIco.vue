<template>
    <svg v-if="name" :class="'icon'" :width="width||24" :height="height||24">
        <use :xlink:href="'#' + name"/>
    </svg>
</template>

<script>
  export default {
    name: 'svg-ico',
    data: () => ({

    }),
    props: ['name', 'width', 'height'],
    methods: {},
    mounted () {
    }
  }
</script>

<style scoped>
</style>
