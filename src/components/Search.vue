<template>
  <el-row>
    <el-row>
      <el-col :span="17" :offset="2">
        <h2><i class="el-icon-search"></i>  搜索测试</h2>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="网站编号">
            <el-input v-model="formInline.websiteId" placeholder="网站编号">
            </el-input>
          </el-form-item>
          <el-form-item label="关键字">
            <el-input v-model="formInline.keyword" placeholder="关键字">
            </el-input>
          </el-select>
        </el-form-item><el-form-item>
          <el-button type="primary" @click="onSubmit">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
  <el-row>

  </el-row>
    <el-col :span="17" :offset="2">
    </el-col>

  <el-row>
    <el-col :span="17" :offset="2">
      <ul :key="result" v-for="result in resultData">
        <search-result :title="result.data.title" :content="result.data.content" :url="result.data.url"></search-result>
      </ul>
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
em {
  color: #FF0000;
}
</style>
<script>
import client from './client'
import searchResult from './searchResult'
export default {
  data () {
    return {
      formInline: {
        websiteId: '',
        keyword: ''
      },
      resultData: [],
      page: 1,
      ipp: 10,
      total: 0
    }
  },
  components: {
    searchResult
  },
  methods: {
    onSubmit () {
      var url = '/api/search/'
      client.post(url, {
        index: 'so-index-' + this.formInline.websiteId,
        query: this.formInline.keyword,
        page: this.page,
        ipp: this.ipp
      })
      .then((response) => {
        console.log(response)
        this.resultData = response.data.hits
        this.total = response.data.total
        console.log(this.resultData)
      })
      .catch((error) => {
        console.log(error)
      })
    },
    handleCurrentChange (val) {
      this.page = val
      this.onSubmit()
    },
    handleSizeChange (val) {
      this.ipp = val
      this.onSubmit()
    }
  }
}
</script>
