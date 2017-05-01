<template>
  <div>
    <p>
      最近的10个任务
    </p>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="任务ID" prop="id">
      </el-table-column>
      <el-table-column label="站点" prop="website">
      </el-table-column>
      <el-table-column label="状态" prop="status">
      </el-table-column>
      <el-table-column label="爬虫" prop="spider">
      </el-table-column>
      <el-table-column label="任务开始时间" prop="created_at">
      </el-table-column>
      <el-table-column label="任务信息最新更新时间" prop="updated_at">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import client from './client'
export default {
  data () {
    return {
      tableData: []
    }
  },
  props: ['spider'],
  created () {
    this.fetchTaskData()
  },
  methods: {
    fetchTaskData () {
      var url = '/api/spidertasks/?spider=' + this.spider
      client.get(url)
      .then((response) => {
        console.log(response)
        var data = response.data
        for (var i = 0; i < data.length; i++) {
          if (data[i].status === 0) {
            data[i].status = '正在进行'
          } else {
            data[i].status = '已完成'
          }
        }
        this.tableData = data
      })
      .catch((error) => {
        console.log(error)
      })
    }
  }
}
</script>
