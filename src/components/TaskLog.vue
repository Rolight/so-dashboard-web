<template>
  <div>
    <el-button type="text" v-if="status == 'idle'">无</el-button>
    <el-button type="text" v-else @click="logDlgVisible = true">
      <i class="el-icon-loading"></i>
      爬取: {{ website }}
    </el-button>
    <el-dialog title="详细信息" v-model="logDlgVisible" size="large">
      <p>
        任务日志
      </p>
      <el-input type="textarea" :value="logData" :readonly="true" :autosize="{ minRows: 15, maxRows: 15}"> </el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="logDlgVisible = false">关闭</el-button>
        <el-button type="danger" @click="forceStopTask">强制结束</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import client from './client'
export default {
  data () {
    return {
      logDlgVisible: false,
      nowLogLine: 0,
      logData: ''
    }
  },
  props: ['taskId', 'status', 'website', 'spider'],
  created () {
    var self = this
    setInterval(function refreshLogData () {
      if (this.logDlgVisible) {
        var url = '/api/spidertasks/' + self.taskId + '/log/?line=' + self.nowLogLine
        client.get(url)
        .then((response) => {
          if (response.data.length > 0) {
            console.log(url)
            console.log(self.nowLogLine)
            console.log(response.data)
            self.nowLogLine += response.data.length
            for (var i = 0; i < response.data.length; i++) {
              self.logData += response.data[i] + '\n'
            }
          }
        })
        .catch((error) => {
          console.log(error)
        })
      }
    }, 2000)
  },
  methods: {
    forceStopTask () {
      var url = '/api/spidertasks/clear/?spider=' + this.spider
      console.log(url)
      client.delete(url)
      .then((response) => {
        this.$message('命令已发送')
      })
      .catch((error) => {
        this.$message('命令未能成功发送 error: ' + error)
      })
    }
  }
}
</script>
