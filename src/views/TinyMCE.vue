<template>
  <div class="home">
    <textarea :id="tinymceId" class="tinymce-textarea" />
  </div>
</template>

<script>


export default {
  name: "TinyMCE",
  data() {
    return {
      // 初始化 tinymce 文本编辑器,当 selector 选中同一个 dom id 时，tinymce 只 init 一次，
      // 所以每次都动态改变 selector 所选中 dom id 
      tinymceId: "vue-tinymce-" + +new Date() + ((Math.random() * 1000).toFixed(0) + ""),
      src: "./tinymce/js/tinymce/tinymce.min.js"
    }
  },
  mounted() {
    this.dynamicLoadScript(this.src);
    
  },

  methods: {
    dynamicLoadScript(src){
      const _this = this;
      const script = document.createElement("script");
      script.src = src; // src url for the third-party library being loaded.
      script.id = src;
      document.body.appendChild(script);
      script.onload = function() {
        // tinymce脚本引入后，初始化
        _this.initTinymce()

      };
      
    },
    initTinymce() {
      window.tinymce.init({
        selector: `#${this.tinymceId}`,
        language:'zh_CN',
        skin: "oxide-dark",
        content_css: "dark"
       
      });
    }
  }
 
}
</script>
<style lang="scss" scoped>
  /* Tinymce加载成功前,会短暂显示textarea元素 */
.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}
/deep/ .tox .tox-promotion-link {
  display: none
}
</style>
