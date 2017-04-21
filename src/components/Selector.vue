<template>
  <div>
    <el-dialog title="创建Selector" v-model="createFormVisible">
      <el-form :model="form">
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input v-model="form.key_name" auto-complete="off" value="string"></el-input>
        </el-form-item>
        <el-form-item label="XPath" :label-width="formLabelWidth">
          <el-input v-model="form.xpath" auto-complete="off" value="string"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createFormVisible = false">取消</el-button>
        <el-button type="primary" @click="doCreate">创建</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑Selector" v-model="editFormVisible">
      <el-form :model="form">
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input v-model="form.key_name" auto-complete="off" value="string"></el-input>
        </el-form-item>
        <el-form-item label="XPath" :label-width="formLabelWidth">
          <el-input v-model="form.xpath" auto-complete="off" value="string"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click="doEdit">编辑</el-button>
      </div>
    </el-dialog>

    <el-form-item label="Title Selector">
      <el-input
      class="input-new-tag"
      v-if="titleInputVisible"
      v-model="titleValue"
      ref="saveTitleInput"
      @keyup.enter.native="handleTitleInput"
      @blur="handleTitleInput"
      >
    </el-input>
    <el-button v-else class="button-new-tag" type="text" @click="showTitleInput">
      {{ titleValue }}
    </el-button>
  </el-form-item>
  <el-form-item label="Body Selector">
    <el-input
        class="input-new-tag"
        v-if="bodyInputVisible"
        v-model="bodyValue"
        ref="saveBodyInput"
        @keyup.enter.native="handleBodyInput"
        @blur="handleBodyInput"
        >
      </el-input>
      <el-button v-else class="button-new-tag" type="text" @click="showBodyInput">
        {{ bodyValue }}
      </el-button>
  </el-form-item>
  <el-form-item label="自定义Selecor">
    <el-button type="text" size="small" v-on:click="handleOpenForm('create', 0)">添加</el-button>
  </el-form-item>
  <el-table :data="customData" border style="width: 100%">
    <el-table-column fixed prop="key_name" label="自定义Selector名称" width="180">
    </el-table-column>
    <el-table-column prop="xpath" label="Selector XPath" width="1600">
    </el-table-column>
    <el-table-column fixed="right" label="操作" width="100" >
      <template scope="props">
        <el-button type="text" size="small" @click="handleOpenForm('edit', props.row.id)">编辑</el-button>
        <el-button @click="doDelete(props.row.id)" class="button-delete" type="text" size="small">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</div>
</template>
<style>
.button-delete {
  color:red;
}
.button-delete:hover {
  color:pink;
}
</style>
<script>
import client from './client'
export default {
  data () {
    return {
      titleInputVisible: false,
      titleValue: '',
      titleData: {},
      bodyInputVisible: false,
      bodyValue: '',
      bodyData: {},
      customData: [],
      createFormVisible: false,
      editFormVisible: false,
      form: {
        key_name: '',
        xpath: ''
      },
      formLabelWidth: '120px'
    }
  },
  props: ['websiteid'],
  created () {
    this.fetchSelectorData()
  },
  methods: {
    doDelete (nowId) {
      var url = '/api/websiteselectors/' + nowId + '/'
      this.$confirm('此操作将永久删除网站及相关信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        client.delete(url)
        .then((response) => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.fetchSelectorData()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    doEdit () {
      console.log(this.form)
      var url = '/api/websiteselectors/' + this.form.id + '/'
      client.put(url, this.form)
      .then((response) => {
        this.$message({
          message: '更新成功',
          type: 'success'
        })
        this.fetchSelectorData()
      })
      .catch((error) => {
        this.$message({
          message: error.response.data,
          type: 'error'
        })
      })
      this.editFormVisible = false
    },
    doCreate () {
      console.log(this.form)
      var url = '/api/websites/' + this.websiteid + '/' + 'websiteselectors/'
      client.post(url, this.form)
      .then((response) => {
        this.$message({
          message: '创建成功',
          type: 'success'
        })
        this.fetchSelectorData()
      })
      .catch((error) => {
        this.$message({
          message: error.response.data,
          type: 'error'
        })
      })
      this.createFormVisible = false
    },
    handleOpenForm (value, nowId) {
      console.log(value, nowId)
      if (value === 'edit') {
        this.editFormVisible = true
        var url = '/api/websiteselectors/' + nowId + '/'
        client.get(url)
        .then((response) => {
          this.form = response.data
          console.log(this.form)
        })
        .catch((error) => {
          console.log(error)
        })
      } else if (value === 'create') {
        this.createFormVisible = true
        this.form = {
          id: '',
          websiteid: this.websiteid,
          key_name: '',
          xpath: ''
        }
      }
    },
    handleBodyInput () {
      this.bodyInputVisible = false
      var url = '/api/websiteselectors/' + this.bodyData.id + '/'
      this.bodyData.xpath = this.bodyValue
      client.put(url, this.bodyData)
    },
    handleTitleInput () {
      this.titleInputVisible = false
      var url = '/api/websiteselectors/' + this.titleData.id + '/'
      this.titleData.xpath = this.titleValue
      client.put(url, this.titleData)
    },
    showBodyInput () {
      this.bodyInputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveBodyInput.$refs.input.focus()
      })
    },
    showTitleInput () {
      this.titleInputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTitleInput.$refs.input.focus()
      })
    },
    fetchSelectorData () {
      var url = '/api/websites/' + this.websiteid + '/websiteselectors/'
      // fetch title data
      client.get(url + '?type=0')
      .then((response) => {
        this.titleData = response['data'][0]
        this.titleValue = this.titleData.xpath
      })
      .catch((error) => {
        console.log(error)
      })
      // fetch body data
      client.get(url + '?type=1')
      .then((response) => {
        this.bodyData = response['data'][0]
        this.bodyValue = this.bodyData.xpath
      })
      .catch((error) => {
        console.log(error)
      })
      // fetch custom data
      client.get(url + '?type=2')
      .then((response) => {
        this.customData = response['data']
      })
      .catch((error) => {
        console.log(error)
      })
    }
  }
}
</script>
