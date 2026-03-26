<template>
  <div class="qr-code-generator">
    <div class="qr-container">
      <!-- 预览区域 -->
      <div class="preview-section">
        <div class="qr-preview" :style="{ width: `${size}px`, height: `${size}px` }">
          <canvas ref="qrCanvas" v-show="false" :width="size" :height="size"></canvas>
          <div v-if="previewUrl" class="preview-image">
            <img :src="previewUrl" alt="QR Code Preview" />
          </div>
        </div>
      </div>

      <!-- 控制面板 -->
      <div class="control-panel">
        <h3>二维码配置</h3>
        
        <div class="form-group">
          <label>二维码内容：</label>
          <textarea 
            v-model="qrData" 
            placeholder="输入网址、文本等内容"
            rows="3"
          ></textarea>
        </div>

        <div class="form-group">
          <label>二维码大小：</label>
          <input type="range" v-model.number="size" min="100" max="800" step="10">
          <span>{{ size }}px</span>
        </div>

        <div class="form-group">
          <label>Logo大小比例：</label>
          <input type="range" v-model.number="logoRatio" min="0.05" max="0.3" step="0.01">
          <span>{{ (logoRatio * 100).toFixed(0) }}%</span>
        </div>

        <div class="form-group">
          <label>Logo图片：</label>
          <div class="logo-upload">
            <input 
              type="file" 
              ref="logoInput" 
              @change="handleLogoUpload"
              accept="image/*"
              style="display: none"
            >
            <button @click="$refs.logoInput.click()" class="upload-btn">
              选择Logo图片
            </button>
            <span v-if="logoFile">{{ logoFile.name }}</span>
          </div>
        </div>

        <div class="form-group" v-if="showLogoPreview && logoImage">
          <label>Logo预览：</label>
          <div class="logo-preview">
            <img :src="logoImage" alt="Logo Preview" />
          </div>
        </div>

        <div class="color-controls">
          <div class="form-group">
            <label>二维码颜色：</label>
            <input type="color" v-model="qrColor">
          </div>
          <div class="form-group">
            <label>背景颜色：</label>
            <input type="color" v-model="bgColor">
          </div>
        </div>

        <div class="actions">
          <button @click="generateQRCode" class="generate-btn">
            <span v-if="!loading">生成二维码</span>
            <span v-else>生成中...</span>
          </button>
          <button @click="downloadQRCode" class="download-btn" :disabled="!previewUrl">
            下载二维码
          </button>
          <button @click="reset" class="reset-btn">
            重置
          </button>
        </div>
      </div>
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcode';

export default {
  name: 'QRCodeWithLogo',
  props: {
    // 初始数据
    initialData: {
      type: String,
      default: 'https://example.com'
    },
    // 初始尺寸
    initialSize: {
      type: Number,
      default: 300
    },
    // 默认Logo URL
    defaultLogoUrl: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      qrData: this.initialData,
      size: this.initialSize,
      logoRatio: 0.2,
      qrColor: '#000000',
      bgColor: '#ffffff',
      logoFile: null,
      logoImage: this.defaultLogoUrl,
      previewUrl: '',
      loading: false,
      error: '',
      showLogoPreview: false
    };
  },
  mounted() {
    // 如果有默认LogoURL，预加载
    if (this.defaultLogoUrl) {
      this.loadLogoFromUrl(this.defaultLogoUrl);
    }
  },
  methods: {
    // 处理Logo上传
    handleLogoUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      // 验证文件类型
      if (!file.type.startsWith('image/')) {
        this.error = '请选择图片文件';
        return;
      }
      
      this.logoFile = file;
      
      // 创建预览
      const reader = new FileReader();
      reader.onload = (e) => {
        this.logoImage = e.target.result;
        this.showLogoPreview = true;
      };
      reader.readAsDataURL(file);
      this.error = '';
    },

    // 从URL加载Logo
    loadLogoFromUrl(url) {
      this.logoImage = url;
      this.showLogoPreview = true;
    },

    // 生成二维码
    async generateQRCode() {
      if (!this.qrData.trim()) {
        this.error = '请输入二维码内容';
        return;
      }

      this.loading = true;
      this.error = '';

      try {
        const canvas = this.$refs.qrCanvas;
        const ctx = canvas.getContext('2d');

        // 清除画布
        ctx.clearRect(0, 0, this.size, this.size);

        // 生成基本二维码
        await QRCode.toCanvas(canvas, this.qrData, {
          width: this.size,
          margin: 1,
          color: {
            dark: this.qrColor,
            light: this.bgColor
          }
        });

        // 如果有Logo，添加到二维码中心
        if (this.logoImage) {
          await this.addLogoToQRCode(ctx);
        }

        // 转换为图片URL供预览和下载
        this.previewUrl = canvas.toDataURL('image/png');
        
        // 触发生成成功事件
        this.$emit('qr-generated', this.previewUrl);
      } catch (err) {
        console.error('生成二维码失败:', err);
        this.error = '生成二维码失败: ' + err.message;
      } finally {
        this.loading = false;
      }
    },

    // 添加Logo到二维码
    addLogoToQRCode(ctx) {
      return new Promise((resolve, reject) => {
        const logo = new Image();
        logo.crossOrigin = 'anonymous';
        
        logo.onload = () => {
          try {
            // 计算Logo尺寸
            const logoSize = Math.floor(this.size * this.logoRatio);
            
            // 计算Logo位置（居中）
            const x = (this.size - logoSize) / 2;
            const y = (this.size - logoSize) / 2;
            
            // 创建临时canvas处理Logo圆角
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = logoSize;
            tempCanvas.height = logoSize;
            
            // 绘制圆角矩形背景
            tempCtx.fillStyle = this.bgColor;
            this.drawRoundedRect(tempCtx, 0, 0, logoSize, logoSize, 10);
            tempCtx.fill();
            
            // 绘制Logo（缩放以适应）
            const logoDrawWidth = Math.min(logoSize * 0.8, logoSize);
            const logoDrawHeight = (logo.height / logo.width) * logoDrawWidth;
            const logoX = (logoSize - logoDrawWidth) / 2;
            const logoY = (logoSize - logoDrawHeight) / 2;
            
            tempCtx.save();
            this.drawRoundedRect(tempCtx, logoX, logoY, logoDrawWidth, logoDrawHeight, 5);
            tempCtx.clip();
            tempCtx.drawImage(logo, logoX, logoY, logoDrawWidth, logoDrawHeight);
            tempCtx.restore();
            
            // 将Logo绘制到二维码上
            ctx.drawImage(tempCanvas, x, y);
            resolve();
          } catch (err) {
            reject(err);
          }
        };
        
        logo.onerror = () => {
          reject(new Error('Logo图片加载失败'));
        };
        
        logo.src = this.logoImage;
      });
    },

    // 绘制圆角矩形
    drawRoundedRect(ctx, x, y, width, height, radius) {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    },

    // 下载二维码
    downloadQRCode() {
      if (!this.previewUrl) return;
      
      const link = document.createElement('a');
      link.download = `qrcode_${Date.now()}.png`;
      link.href = this.previewUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      this.$emit('qr-downloaded', this.previewUrl);
    },

    // 重置
    reset() {
      this.qrData = this.initialData;
      this.size = this.initialSize;
      this.logoRatio = 0.2;
      this.qrColor = '#000000';
      this.bgColor = '#ffffff';
      this.logoFile = null;
      this.logoImage = this.defaultLogoUrl;
      this.previewUrl = '';
      this.error = '';
      this.showLogoPreview = false;
      this.$refs.logoInput.value = '';
      
      this.$emit('reset');
    }
  },
  watch: {
    // 监听配置变化，自动重新生成
    size(newVal) {
      if (this.previewUrl && this.qrData) {
        this.generateQRCode();
      }
    },
    logoRatio(newVal) {
      if (this.previewUrl && this.logoImage) {
        this.generateQRCode();
      }
    },
    qrColor(newVal) {
      if (this.previewUrl) {
        this.generateQRCode();
      }
    },
    bgColor(newVal) {
      if (this.previewUrl) {
        this.generateQRCode();
      }
    }
  }
};
</script>

<style scoped>
.qr-code-generator {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.qr-container {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.preview-section {
  flex: 1;
  min-width: 300px;
}

.qr-preview {
  position: relative;
  margin: 0 auto;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.preview-image img {
  max-width: 100%;
  height: auto;
  display: block;
}

.control-panel {
  flex: 1;
  min-width: 300px;
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.control-panel h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
  font-size: 1.4em;
  border-bottom: 2px solid #007bff;
  padding-bottom: 10px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #555;
}

.form-group input[type="range"] {
  width: 70%;
  margin-right: 10px;
  vertical-align: middle;
}

.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  resize: vertical;
  transition: border-color 0.3s;
}

.form-group textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.logo-upload {
  display: flex;
  align-items: center;
  gap: 10px;
}

.upload-btn {
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.upload-btn:hover {
  background: #0056b3;
}

.logo-preview {
  width: 80px;
  height: 80px;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-preview img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.color-controls {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.color-controls .form-group {
  flex: 1;
}

.color-controls input[type="color"] {
  width: 60px;
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.actions {
  display: flex;
  gap: 12px;
  margin-top: 30px;
}

.actions button {
  flex: 1;
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.generate-btn {
  background: #28a745;
  color: white;
}

.generate-btn:hover:not(:disabled) {
  background: #218838;
  transform: translateY(-2px);
}

.download-btn {
  background: #17a2b8;
  color: white;
}

.download-btn:hover:not(:disabled) {
  background: #138496;
  transform: translateY(-2px);
}

.download-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.reset-btn {
  background: #6c757d;
  color: white;
}

.reset-btn:hover {
  background: #545b62;
  transform: translateY(-2px);
}

.error-message {
  margin-top: 20px;
  padding: 12px;
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  text-align: center;
}

@media (max-width: 768px) {
  .qr-container {
    flex-direction: column;
  }
  
  .color-controls {
    flex-direction: column;
    gap: 10px;
  }
}
</style>