<template>
  <div id="app">
    <el-row>
      <Navbar></Navbar>
    </el-row>
    <el-row>
      <router-view></router-view>
    </el-row>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
export default {
  name: 'app',
  components: {
    Navbar
  }
}
</script>
<style>
.el-row {
        margin-bottom: 20px;
        &:last-child {
            margin-bottom: 0;
        }
    }
    .el-col {
        border-radius: 4px;
    }
</style>
