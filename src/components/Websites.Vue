<template>
  <el-row>
    <el-row>
      <el-col :span="17" :offset="2">
        <h2><i class="el-icon-upload"></i>  索引站点</h2>
      </el-col>
      <el-col :span="4">
        <h2>
          <el-button type="success" @click="createFormVisible = true">添加新网站</el-button>
        </h2>
      </el-col>
      <el-dialog title="创建新网站" v-model="createFormVisible">
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
          <el-button @click="cancelCreate">取消</el-button>
          <el-button type="primary" @click="doCreate">创建</el-button>
        </div>
      </el-dialog>
    </el-row>
    <el-row>
      <el-col :span="20" :offset="2">
        <el-table :data="websiteData" style="width: 100%">
          <el-table-column type="expand">
            <template scope="props">
              <el-form label-position="left" inline class="table-expand">
                <el-form-item label="编号">
                  <span>{{ props.row.id }}</span>
                </el-form-item>
                <el-form-item label="索引名称">
                  <span>{{ props.row.title }}</span>
                </el-form-item>
                <el-form-item label="爬取间隔时间">
                  <span>{{ props.row.sleep_seconds }}</span>
                </el-form-item>
                <el-form-item label="爬取周期 ">
                  <span>{{ props.row.schedule_type }}</span>
                </el-form-item>
                <el-form-item label="页面过期时间(秒)">
                  <span>{{ props.row.expire_seconds }}</span>
                </el-form-item>
                <allowed-domain :websiteid="props.row.id"></allowed-domain>
                <el-form-item label="起始URL">
                  <url-pattern :websiteid="props.row.id" :type="2"></url-pattern>
                </el-form-item>
                <el-form-item label="抓取URL Pattern">
                  <url-pattern :websiteid="props.row.id" :type="0"></url-pattern>
                </el-form-item>
                <el-form-item label="Walk URL Pattern">
                  <url-pattern :websiteid="props.row.id" :type="1"></url-pattern>
                </el-form-item>
                <selector :websiteid="props.row.id">
                </selector>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="索引名称" prop="title">
          </el-table-column>
          <el-table-column label="爬取间隔时间" prop="sleep_seconds">
          </el-table-column>
          <el-table-column label="爬取周期" prop="schedule_type">
          </el-table-column>
          <el-table-column label="页面过期时间(秒)" prop="expire_seconds">
          </el-table-column>
          <el-table-column label="操作">
            <template scope="scope">
              <website-edit-dig v-on:updated="fetchWebsiteData" :websiteid="scope.row.id"></website-edit-dig>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8" :offset="6">
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="ipp"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      </el-col>
    </el-row>
  </el-row>
  </template>

<style>
.table-expand {
  font-size: 0;
}
.table-expand label {
  width: 160px;
  color: #99a9bf;
}
.table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
</style>

<script>
import client from './client'
import types from './types'
import AllowedDomain from './AllowedDomain'
import UrlPattern from './UrlPattern'
import WebsiteEditDig from './WebsiteEditDig'
import Selector from './Selector'
export default {
  name: 'Websites',
  data () {
    return {
      websiteData: [],
      createFormVisible: false,
      form: {
        title: '',
        sleep_seconds: 0,
        schedule_type: 0,
        expire_seconds: 864000
      },
      formLabelWidth: '120px',
      page: 1,
      ipp: 10,
      total: 0
    }
  },
  created () {
    // fetch the data when the view is created and the data is
    // already being observed
    this.fetchWebsiteData()
  },
  watch: {
    // call again the method if the route changes
    '$route': 'fetchWebsiteData'
  },
  components: {
    AllowedDomain,
    UrlPattern,
    WebsiteEditDig,
    Selector
  },
  methods: {
    clearForm () {
      this.form = {
        title: '',
        sleep_seconds: 0,
        schedule_type: 0,
        expire_seconds: 864000
      }
    },
    fetchWebsiteData () {
      // fields = ['title', 'sleep_seconds', 'schedule_type', 'expire_seconds']
      var url = '/api/websites/' + '?page=' + this.page + '&ipp=' + this.ipp
      client.get(url)
      .then((response) => {
        console.log(response)
        var websiteData = response['data']['results']
        this.total = response['data']['count']
        for (var i = 0; i < websiteData.length; i++) {
          var schedule = websiteData[i]['schedule_type']
          websiteData[i]['schedule_type'] = types.schedule[schedule]
          websiteData[i]['expire_seconds'] = String(websiteData[i]['expire_seconds'])
        }
        this.websiteData = response['data']['results']
        console.log(this.websiteData)
      }).catch((error) => {
        console.log(error)
      })
    },
    cancelCreate () {
      this.createFormVisible = false
      this.clearForm()
    },
    doCreate () {
      var url = '/api/websites/'
      client.post(url, this.form)
      .then((response) => {
        this.fetchWebsiteData()
        this.$message({
          message: '创建成功',
          type: 'success'
        })
      })
      .catch((error) => {
        this.$message({
          message: error.response.data,
          type: 'error'
        })
        console.log(error)
      })
      this.clearForm()
      this.createFormVisible = false
    },
    handleSizeChange (val) {
      this.ipp = val
      this.fetchWebsiteData()
    },
    handleCurrentChange (val) {
      this.page = val
      this.fetchWebsiteData()
    }
  }
}
</script>
