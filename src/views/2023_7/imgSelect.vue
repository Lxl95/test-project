<template>
  <div>
    <el-button @click="dialogVisible = true">Click</el-button>
    <el-dialog title="图片选择" :visible.sync="dialogVisible">
      <div class="imgList">
        <div class="img-item" v-for="(item, index) in imgDataList" :class="{ active: item.id == flag }" :key="index" @click="checkImg(item)">
          <img :src="item.imgSrc" alt="" />
        </div>
      </div>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'ImgSelect',
  data() {
    return {
      dialogVisible: false,
      flag: false,
      imgDataList: [
        {
          id: '001',
          imgSrc: 'http://browser9.qhimg.com/bdm/480_296_0/t01bbd94b90e850d1d3.jpg'
        },
        {
          id: '002',
          imgSrc: 'http://browser9.qhimg.com/bdm/480_296_0/t01bbd94b90e850d1d3.jpg'
        },
        {
          id: '003',
          imgSrc: 'http://browser9.qhimg.com/bdm/480_296_0/t01bbd94b90e850d1d3.jpg'
        },
        {
          id: '004',
          imgSrc: 'http://browser9.qhimg.com/bdm/480_296_0/t01bbd94b90e850d1d3.jpg'
        }
      ]
    };
  },
  mounted() {},
  methods: {
    checkImg(item) {
      this.flag = item.id;
    }
  }
};
</script>
<style lang="scss" scoped>
.imgList {
  width: 98%;
  margin: 20px 0;
  background-color: #fff;
  display: flex;
  flex-wrap: wrap;
  .active {
    display: block;
    width: 196px;
    height: 196px;
    line-height: 0;
    font-size: 0;
    vertical-align: middle;
    border: 3px solid #2b89fd;
    -webkit-transform: rotate(0deg);
  }
  .active::before {
    content: '';
    position: absolute;
    right: 0;
    bottom: 0;
    border: 12px solid #2b89fd;
    border-top-color: transparent;
    border-left-color: transparent;
  }
  .active::after {
    content: '';
    display: block;
    width: 5px;
    height: 10px;
    position: absolute;
    right: 4px;
    bottom: 5px;
    border: 1px solid #fff;
    border-top-color: transparent;
    border-left-color: transparent;
    transform: rotate(45deg);
    cursor: pointer;
  }
  .img-item {
    width: 196px;
    height: 196px;
    overflow: hidden;
    background-color: #ffffff;
    margin: 20px;
    cursor: pointer;
    img {
      height: 196px;
    }
  }
}
</style>
