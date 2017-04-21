<template>
  <el-form-item label="允许被爬取的主机名">
    <el-tag type="success" :key="allowedDomain" v-for="allowedDomain in allowedDomains" :closable="true" :close-transition="false" @close="handleClose(allowedDomain)">
      {{ allowedDomain.domain }}
    </el-tag>
    <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="mini" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
    </el-input>
    <el-button v-else class="button-new-tag" type="text" size="small" @click="showInput">+ 添加</el-button>
  </el-form-item>
</template>
<script>
import client from './client'
export default {
  data () {
    return {
      allowedDomains: [],
      inputValue: '',
      inputVisible: false
    }
  },
  props: ['websiteid'],
  created () {
    this.fetchAllowDomainData()
  },
  watch: {
    '$route': 'fetchAllowDomainData'
  },
  methods: {
    fetchAllowDomainData () {
      var url = '/api/websites/' + this.websiteid + '/websitealloweddomains/'
      client.get(url)
      .then((response) => {
        this.allowedDomains = response['data']
        console.log(this.allowedDomains)
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
      var url = '/api/websitealloweddomains/' + tag.id + '/'
      console.log(url)
      client.delete(url)
      .then((response) => {
        this.allowedDomains.splice(this.allowedDomains.indexOf(tag), 1)
      })
      .catch((err) => {
        console.log(err)
      })
    },
    handleInputConfirm () {
      let inputValue = this.inputValue
      var url = '/api/websites/' + this.websiteid + '/websitealloweddomains/'
      client.post(url, {
        'website_id': this.websiteid,
        'domain': inputValue
      })
      .then((response) => {
        this.allowedDomains.push(response['data'])
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
