<template>
  <svg
    :x="x" :y="y"
    :width="width"
    height="60"
    :style="{cursor: dragging?'grabbing':'grab'}"
    @mouseenter="hover=true"
    @mouseleave="hover=false"
  >
    <rect
      fill="#000"
      :fill-opacity="titleFillOpacity"
      x="0" y="0"
      rx="3" ry="3"
      :width="width"
      height="60"
    />
    <svg x="0" y="0" :width="deletable ? width - 17 : width" height="60">
      <title>{{ title }}</title>
      <text x="2" y="13" font-size="16" font-weight="normal" fill="#fff">{{ title }}</text>
      <!-- 标题 -->
      <!-- <foreignObject
        :x="2"
        :y="2"
        width="60px"
        height="120px"
      >
        <div class="table-title">
          {{ title }}
        </div>
      </foreignObject> -->
    </svg>

    <svg
      v-if="deletable && !readonly"
      :x="width - 15" y="1"
      width="14" height="14"
      class="diagram-editor__delete"
      @click="$emit('delete')"
    >
      <rect
        x="0"
        y="0"
        width="14"
        height="14"
        rx="2" ry="2"
      />
      <line
        :x1="1" :y1="1"
        :x2="13" :y2="13"
      />
      <line
        :x1="13" :y1="1"
        :x2="1" :y2="13"
      />
    </svg>
  </svg>
</template>

<script>
export default {
  name: 'DiagramNodeTitle',
  props: {
    x: {
      type: Number,
      required: true
    },
    y: {
      type: Number,
      required: true
    },
    width: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    deletable: {
      type: Boolean,
      default: true
    },
    dragging: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    hover: false,
  }),
  computed: {
    titleFillOpacity() {
      return this.hover ? 0.3 : 0.1;
    }
  },
};
</script>

