<template>
  <div>
    <el-button type="warning"  size="small" @click="onRun">
      <i class="el-icon-caret-right"></i>
    </el-button>
    <el-button type="primary" icon="edit" size="small" @click="onEdit"></el-button>
    <el-button type="danger" icon="delete" size="small" @click="onDelete"></el-button>
    <el-dialog title="更新网站" v-model="editFormVisible">
      <el-form :model="form">
        <el-form-item label="网站名称" :label-width="formLabelWidth">
          <el-input v-model="form.title" auto-complete="off" value="string"></el-input>
        </el-form-item>
        <el-form-item label="爬取间隔时间(单位为秒)" :label-width="formLabelWidth">
          <el-input v-model="form.sleep_seconds" auto-complete="off" value="number"></el-input>
        </el-form-item>
        <el-form-item label="爬取周期" :label-width="formLabelWidth">
          <el-select v-model="form.schedule_type" placeholder="请选择活动区域">
            <el-option label="每小时" value="0"></el-option>
            <el-option label="每天" value="1"></el-option>
            <el-option label="每周" value="2"></el-option>
            <el-option label="每月" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="页面过期时间(单位为秒)" :label-width="formLabelWidth">
          <el-input v-model="form.expire_seconds" auto-complete="off" value="number"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click="doEdit">更新</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import client from './client'
export default {
  data () {
    return {
      editFormVisible: false,
      form: {
        title: '',
        sleep_seconds: 0,
        schedule_type: 0,
        expire_seconds: 864000
      },
      formLabelWidth: '120px'
    }
  },
  props: ['websiteid'],
  methods: {
    onEdit () {
      var url = '/api/websites/' + this.websiteid + '/'
      client.get(url)
      .then((response) => {
        this.form = response.data
        this.editFormVisible = true
      })
      .catch((error) => {
        console.log(error)
      })
    },
    doEdit () {
      var url = '/api/websites/' + this.websiteid + '/'
      client.put(url, this.form)
      .then((response) => {
        this.$message({
          message: '更新成功',
          type: 'success'
        })
        this.$emit('updated')
      })
      .catch((error) => {
        this.$message({
          message: error.response.data,
          type: 'error'
        })
        console.log(error)
      })
      this.editFormVisible = false
    },
    onDelete () {
      this.$confirm('此操作将永久删除网站及相关信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.doDelete()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    doDelete () {
      var url = '/api/websites/' + this.websiteid + '/'
      client.delete(url)
      .then((response) => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.$emit('updated')
      })
      .catch((error) => {
        this.$message({
          message: error.response.data,
          type: 'error'
        })
        console.log(error)
      })
    },
    onRun () {
      var url = '/api/spidertasks/'
      client.post(url, {website_id: this.websiteid})
      .then((response) => {
        this.$message(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
    }
  }
}
</script>
