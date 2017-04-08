<template>
  <el-row>
    <el-row>
      <el-col :span="8" :offset="5">
        <h3>管理员登录</h3>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="9" :offset="4">
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item label="管理员账号">
            <el-input v-model="form.username"></el-input>
          </el-form-item>
          <el-form-item label="管理密码">
            <el-input type="password" v-model="form.password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">登录</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-row>
</template>
<script>
import client from './client'
export default {
  name: 'Login',
  data () {
    return {
      form: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    onSubmit () {
      console.log('submit!')
      console.log(this.form.username)
      console.log(this.form.password)
      client.post(
        '/api/login/',
        {
          username: this.form.username,
          password: this.form.password
        }
      ).then((response) => {
        console.log(response)
        localStorage.setItem('accessToken', response['data']['token'])
        this.$message({
          message: '登录成功！',
          type: 'success'
        })
      }).catch((error) => {
        console.log(error)
        this.$message.error('登录失败')
      })
    }
  }
}
</script>
