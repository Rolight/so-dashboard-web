<template>
  <div id="navbar">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="home">接入式搜索引擎系统</el-menu-item>
      <el-menu-item index="websites"><i class="el-icon-upload"></i>索引站点</el-menu-item>
      <el-menu-item index="spiders"><i class="el-icon-time"></i>爬虫任务</el-menu-item>
      <el-menu-item index="logout">登出</el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import router from '@/router'
export default {
  name: 'Navbar',
  data () {
    return {
      activeIndex: '1'
    }
  },
  methods: {
    handleSelect (key, keyPath) {
      switch (key) {
        case 'home':
          console.log(key, keyPath)
          router.push({ path: '/' })
          break
        case 'websites':
          console.log(key, keyPath)
          router.push({ path: '/websites/' })
      }
      console.log(key, keyPath)
    }
  }
}
</script>
