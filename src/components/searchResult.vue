<template>
  <ul>
    <a :href="url"><h4 v-html="title"></h4></a>
    <p v-html="content">
    </p>
  </ul>
</template>
<script>
export default {
  data () {
    return {
    }
  },
  props: ['title', 'content', 'url']
}
</script>
