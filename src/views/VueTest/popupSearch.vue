<template>
  <form class="search" v-draggabled>
    <div class="search__wrapper">
      <input type="text" name="" placeholder="Search for..." class="search__field" />
      <button type="submit" class="search__icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="feather feather-search"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>
    </div>
  </form>
</template>

<script>
export default {
  name: 'popupSearch',
  directive: {
    draggabled: {
      bind(el, binding, vnode) {
        el.style.position = 'absolute';
        const that = vnode.context
        el.onmousedown = function (e) {
          const disX = e.clientX - el.offsetLeft;
          const disY = e.clientY - el.offsetTop;
          console.log(e.target.className);
          document.onmousemove = function (e) {
            const left = e.clientX - disX;
            const top = e.clientY - disY;
            el.style.left = left + 'px';
            el.style.top = top + 'px';
          };
          document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
          };
        };
      }
    }
  }
};
</script>

<style scope>
.search {
  position: absolute;
  top: 100px;
  left: calc(100% - 40px);
}
.search * {
  outline: none;
  box-sizing: border-box;
}
.search__wrapper {
  position: absolute;
  right: 0;
}
.search__field {
  width: 50px;
  height: 50px;
  color: transparent;
  font-family: Lato, sans-serif;
  /* font-size: 1.35em; */
  padding: 0.35em 50px 0.35em 0;
  border: 1px solid transparent;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  position: absolute;
  right: 0;
}
.search__field:focus {
  border-bottom-color: #ccc;
  width: 350px;
  border-radius: 0;
  padding-left: 10px;
  color: #2b2b2b;
  cursor: default;
  position: absolute;
  right: 0;
  display: inline-block;
}
.search__field:focus ~ .search__icon {
  background-color: transparent;
  cursor: pointer;
  pointer-events: auto;
}
.search__icon {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #e9f1f4;
  width: 50px;
  height: 50px;
  font-size: 1.35em;
  text-align: center;
  border-color: transparent;
  border-radius: 50%;
  pointer-events: none;
  display: inline-block;
  transition: background-color 0.2s ease-in-out;
}
.search__field::-webkit-input-placeholder {
  position: relative;
  top: 0;
  left: 0;
  -webkit-transition-property: top, color;
  transition-property: top, color;
  transition-duration: 0.1s;
  transform: translateZ(0);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  perspective: 1000;
}
.search__field:-moz-placeholder {
  position: relative;
  top: 0;
  left: 0;
  -moz-transition-property: top, color;
  transition-property: top, color;
  transition-duration: 0.1s;
  transform: translateZ(0);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  perspective: 1000;
}
.search__field::-moz-placeholder {
  position: relative;
  top: 0;
  left: 0;
  -moz-transition-property: top, color;
  transition-property: top, color;
  transition-duration: 0.1s;
  transform: translateZ(0);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  perspective: 1000;
}
.search__field:-ms-input-placeholder {
  position: relative;
  top: 0;
  left: 0;
  -ms-transition-property: top, color;
  transition-property: top, color;
  transition-duration: 0.1s;
  transform: translateZ(0);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  perspective: 1000;
}
.search__field::-webkit-input-placeholder[style*='hidden'] {
  color: #83b0c1;
  font-size: 0.65em;
  font-weight: normal;
  top: -20px;
  opacity: 1;
  visibility: visible !important;
}
.search__field:-moz-placeholder[style*='hidden'] {
  color: #83b0c1;
  font-size: 0.65em;
  font-weight: normal;
  top: -20px;
  opacity: 1;
  visibility: visible !important;
}
.search__field::-moz-placeholder[style*='hidden'] {
  color: #83b0c1;
  font-size: 0.65em;
  font-weight: normal;
  top: -20px;
  opacity: 1;
  visibility: visible !important;
}
.search__field:-ms-input-placeholder[style*='hidden'] {
  color: #83b0c1;
  font-size: 0.65em;
  font-weight: normal;
  top: -20px;
  opacity: 1;
  visibility: visible !important;
}
</style>
