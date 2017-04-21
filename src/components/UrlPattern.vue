<template>
  <div>
    <el-tag type="primary" :key="urlPattern" v-for="urlPattern in urlPatterns" :closable="true" :close-transition="false" @close="handleClose(urlPattern)">
      {{ urlPattern.pattern }}
    </el-tag>
    <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="mini" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
    </el-input>
    <el-button v-else class="button-new-tag" size="small" type="text" @click="showInput">+ 添加</el-button>
  </div>
</template>
<script>
import client from './client'
export default {
  data () {
    return {
      urlPatterns: [],
      inputValue: '',
      inputVisible: false
    }
  },
  props: ['websiteid', 'title', 'type'],
  created () {
    this.fetchUrlPatternData()
  },
  watch: {
    '$route': 'fetchUrlPatternData'
  },
  methods: {
    fetchUrlPatternData () {
      var url = '/api/websites/' + this.websiteid + '/websiteurlpatterns/' + '?type=' + this.type
      client.get(url)
      .then((response) => {
        this.urlPatterns = response['data']
        console.log(this.urlPatterns)
      }).catch((error) => {
        console.log(error)
      })
    },
    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleClose (tag) {
      var url = '/api/websiteurlpatterns/' + tag.id + '/'
      console.log(url)
      client.delete(url)
      .then((response) => {
        this.urlPatterns.splice(this.urlPatterns.indexOf(tag), 1)
      })
      .catch((err) => {
        console.log(err)
      })
    },
    handleInputConfirm () {
      let inputValue = this.inputValue
      var url = '/api/websites/' + this.websiteid + '/websiteurlpatterns/'
      client.post(url, {
        'website_id': this.websiteid,
        'pattern': inputValue,
        'pattern_type': this.type
      })
      .then((response) => {
        this.urlPatterns.push(response['data'])
      })
      .catch((err) => {
        console.log(err)
      })
      this.inputVisible = false
      this.inputValue = ''
    }
  }
}
</script>
