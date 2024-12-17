<template>
  <div class="hello">
    <el-upload class="upload-demo" action="" :before-upload="beforeUpload">
      <i class="el-icon-upload"></i><em>点击上传</em>
      <div class="el-upload__tip" slot="tip">只能上传xlsx文件，</div>
    </el-upload>
    <div id="luckysheet" class="luckysheet-content"></div>
  </div>
</template>

<script>
import LuckyExcel from 'luckyexcel'
export default {
  name: 'TestExcel',
  data() {
    return {}
  },
  mounted() {
  },
  methods: {
    beforeUpload(file) {
      this.init(file)
    },
    init(file) {
      LuckyExcel.transformExcelToLucky(
        file,
        function (exportJson, luckysheetfile) {
          // 获得转化后的表格数据后，使用luckysheet初始化，或者更新已有的luckysheet工作簿
          // 注：luckysheet需要引入依赖包和初始化表格容器才可以使用
          console.log(exportJson)
          luckysheet.create({
            container: 'luckysheet', // luckysheet is the container id
            data: exportJson.sheets,
            title: exportJson.info.name,
            userInfo: exportJson.info.name.creator,
            lang: 'zh', // 设定表格语言
            showinfobar: false, //是否显示顶部信息栏
            showtoolbar: false, //是否显示顶部工具栏
            sheetFormulaBar: false //是否显示公式栏
          })
          // this.createExcel()
        },
        function (err) {
          logger.error('Import failed. Is your fail a valid xlsx?')
        }
      )
    },
    createExcel() {
      LuckyExcel.create({
        container: 'luckysheet', // 设定DOM容器的id
        title: 'Luckysheet Demo', // 设定表格名称
        lang: 'zh', // 设定表格语言
        plugins: ['chart'],
        data: [
          {
            name: '表1', //工作表名称
            color: '#eee333', //工作表(工作表名称底部边框线)颜色
            index: 0, //工作表索引(新增一个工作表时该值是一个随机字符串)
            status: 1, //激活状态
            order: 0, //工作表的下标
            hide: 0, //是否隐藏
            row: 36, //行数
            column: 10, //列数
            defaultRowHeight: 28, //自定义行高,单位px
            defaultColWidth: 100, //自定义列宽,单位px
            celldata: [], //初始化使用的单元格数据,r代表行，c代表列，v代表该单元格的值，最后展示的是value1，value2
            config: {
              merge: {}, //合并单元格
              rowlen: {}, //表格行高
              columnlen: {}, //表格列宽
              rowhidden: {}, //隐藏行
              colhidden: {}, //隐藏列
              borderInfo: {}, //边框
              authority: {} //工作表保护
            },

            scrollLeft: 0, //左右滚动条位置
            scrollTop: 0, //上下滚动条位置
            luckysheet_select_save: [], //选中的区域
            calcChain: [], //公式链
            isPivotTable: false, //是否数据透视表
            pivotTable: {}, //数据透视表设置
            filter_select: {}, //筛选范围
            filter: null, //筛选配置
            luckysheet_alternateformat_save: [], //交替颜色
            luckysheet_alternateformat_save_modelCustom: [], //自定义交替颜色
            luckysheet_conditionformat_save: {}, //条件格式
            frozen: {}, //冻结行列配置
            chart: [], //图表配置
            zoomRatio: 1, // 缩放比例
            image: [], //图片
            showGridLines: 1, //是否显示网格线
            dataVerification: {} //数据验证配置
          }
        ],
        showtoolbar: false,
        showtoolbarConfig: {
          undoRedo: false, //撤销重做，注意撤消重做是两个按钮，由这一个配置决定显示还是隐藏
          paintFormat: false, //格式刷
          currencyFormat: false, //货币格式
          percentageFormat: false, //百分比格式
          numberDecrease: false, // '减少小数位数'
          numberIncrease: false, // '增加小数位数
          moreFormats: false, // '更多格式'
          font: false, // '字体'
          fontSize: false, // '字号大小'
          bold: false, // '粗体 (Ctrl+B)'
          italic: false, // '斜体 (Ctrl+I)'
          strikethrough: false, // '删除线 (Alt+Shift+5)'
          underline: false, // '下划线 (Alt+Shift+6)'
          textColor: false, // '文本颜色'
          fillColor: false, // '单元格颜色'
          border: false, // '边框'
          mergeCell: false, // '合并单元格'
          horizontalAlignMode: false, // '水平对齐方式'
          verticalAlignMode: false, // '垂直对齐方式'
          textWrapMode: false, // '换行方式'
          textRotateMode: false, // '文本旋转方式'
          image: false, // '插入图片'
          link: false, // '插入链接'
          chart: false, // '图表'（图标隐藏，但是如果配置了chart插件，右击仍然可以新建图表）
          postil: false, //'批注'
          pivotTable: false, //'数据透视表'
          function: false, // '公式'
          frozenMode: false, // '冻结方式'
          sortAndFilter: false, // '排序和筛选'
          conditionalFormat: false, // '条件格式'
          dataVerification: false, // '数据验证'
          splitColumn: false, // '分列'
          screenshot: false, // '截图'
          findAndReplace: false, // '查找替换'
          protection: false, // '工作表保护'
          print: false // '打印'
        },
        showsheetbar: false, //是否显示底部sheet页按钮
        showsheetbarConfig: {
          add: false, //新增sheet
          menu: false, //sheet管理菜单
          sheet: false //sheet页显示
        },
        showinfobar: false, //是否显示顶部信息栏
        showstatisticBar: false, //是否显示底部计数栏
        showstatisticBarConfig: {
          count: false, // 计数栏
          view: false, // 打印视图
          zoom: false // 缩放
        },
        sheetFormulaBar: false, //是否显示公式栏
        allowCopy: false, //是否允许拷贝
        enableAddRow: true //允许添加行
      })
    }
  }
}
</script>
<style lang="css" scoped>
.luckysheet-content {
  margin: 0px;
  padding: 0px;
  position: absolute;
  width: 100%;
  height: 500px;
  left: 0px;
  top: 300px;
  bottom: 0px;
}
</style>
