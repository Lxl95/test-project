<template>
  <div>
    <el-button @click="generatePdf2">Generate PDF2</el-button>

    <div id="pdfDom" ref="contentToConvert" style="position: fixed; z-index: -2000; top: 2000px; width: 100vw">
      <!-- 这里放置你想要转换为PDF的内容 -->
      <h1>Hello, World!</h1>
      <!-- svg导出失败，html2canvas版本@1.4.1 -->
      <svg version="1.1" baseProfile="full" width="300" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="red" />
        <circle cx="150" cy="100" r="80" fill="green" />
        <text x="150" y="125" font-size="60" text-anchor="middle" fill="white">SVG</text>
      </svg>

      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
      <p>This is a sample content to convert into PDF.</p>
    </div>
  </div>
</template>

<script>
import htmlToPdf from '@/utils/htmlToPDF.js';

export default {
  name: 'PdfGenerator',
  methods: {
    generatePdf2() {
      htmlToPdf.getPdf('下载名称', this.$refs.contentToConvert);
    }
  }
};
</script>

<style scoped></style>
