<template>
  <el-row>
    <el-row>
      <el-col :span="17" :offset="2">
        <h2><i class="el-icon-upload"></i>  爬虫任务</h2>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="20" :offset="2">
        <el-table :data="spiderData" syple="width: 100%">
          <el-table-column type="expand">
            <template scope="props">
              <spider-history-tasks :spider="props.row.name"></spider-history-tasks>
            </template>
          </el-table-column>
          <el-table-column label="爬虫名称" prop="name">
          </el-table-column>
          <el-table-column label="爬虫状态" prop="status">
          </el-table-column>
          <el-table-column label="正在执行的任务">
            <template scope="scope">
              <task-log :taskId="scope.row.task_id" :status="scope.row.status" :website="scope.row.website" :spider="scope.row.name"></task-log>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </el-row>
</template>

<script>
import client from './client'
import TaskLog from './TaskLog'
import SpiderHistoryTasks from './SpiderHistoryTasks'
export default {
  data () {
    return {
      spiderClusterData: [],
      spiderData: [],
      logDlgVisible: false,
      logTaskId: 0
    }
  },
  components: {
    TaskLog,
    SpiderHistoryTasks
  },
  created () {
    this.fetchSpiderData()
  },
  methods: {
    showTaskInfo (taskId) {
      this.logTaskId = taskId
      this.logDlgVisible = true
      console.log('cjdiosacjoasjo')
      console.log(this.logTaskId)
    },
    fetchSpiderData () {
      var url = '/api/spidertasks/spiders/'
      client.get(url)
      .then((response) => {
        console.log(response)
        this.spiderData = response.data.spiders
        this.spiderClusterData = response.data.all_spiders
      })
      .catch((error) => {
        console.log(error)
      })
    }
  }
}
</script>
