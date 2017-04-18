<template>
  <el-row>
    <el-row>
      <el-col :span="18" :offset="2">
        <h2><i class="el-icon-upload"></i>  索引站点</h2>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="20" :offset="2">
        <el-table :data="websiteData" style="width: 100%">
          <el-table-column type="expand">
            <template scope="props">
              <el-form label-position="left" inline class="table-expand">
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
            <el-button type="primary" icon="edit" size="small"></el-button>
            <el-button type="danger" icon="delete" size="small"></el-button>
          </template>
        </el-table-column>
      </el-table>
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
export default {
  name: 'Websites',
  data () {
    return {
      websiteData: []
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
    UrlPattern
  },
  methods: {
    fetchWebsiteData () {
      // fields = ['title', 'sleep_seconds', 'schedule_type', 'expire_seconds']
      var url = '/api/websites/'
      client.get(url)
      .then((response) => {
        var websiteData = response['data']['results']
        console.log('cascsac', types)
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
    }
  }
}
</script>
