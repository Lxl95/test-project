// utils/codeGenerator.js
export const generateCodeByRule = (rule, index) => {
    if (!rule || !rule.pattern) return ''
    
    let result = rule.pattern
    
    // 替换序列号 {SEQ:n}
    result = result.replace(/\{SEQ:(\d+)\}/g, (match, length) => {
      return String(index + 1).padStart(parseInt(length), '0')
    })
    
    // 替换日期 {YYYYMMDD}
    result = result.replace(/\{YYYYMMDD\}/g, () => {
      const now = new Date()
      return `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`
    })
    
    // 替换随机数 {RANDOM:n}
    result = result.replace(/\{RANDOM:(\d+)\}/g, (match, length) => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      let random = ''
      for (let i = 0; i < parseInt(length); i++) {
        random += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return random
    })
    
    // 替换前缀 {PREFIX}
    result = result.replace(/\{PREFIX\}/g, '')
    
    return result
  }
  
  // 批量生成编码
  export const generateBatchCodes = (rule, quantity) => {
    const codes = []
    for (let i = 0; i < quantity; i++) {
      codes.push(generateCodeByRule(rule, i))
    }
    return codes
  }


  // utils/printAPI.js
// 模拟打印机API
class PrintAPI {
    // 获取打印机列表
    static async getPrinters() {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve([
            { id: '1', name: '办公室打印机', type: '热敏', online: true },
            { id: '2', name: '仓库打印机', type: '标签', online: true },
            { id: '3', name: '便携打印机', type: '蓝牙', online: false }
          ])
        }, 500)
      })
    }
  
    // 发送打印任务
    static async print(jobData) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // 模拟可能失败的情况
          const successRate = 0.9
          if (Math.random() < successRate) {
            resolve({
              success: true,
              jobId: `PRINT_${Date.now()}`,
              message: '打印任务已发送'
            })
          } else {
            reject(new Error('打印机连接失败'))
          }
        }, 1000)
      })
    }
  
    // 查询打印状态
    static async getPrintStatus(jobId) {
      return new Promise(resolve => {
        setTimeout(() => {
          const statuses = ['printing', 'completed', 'error']
          const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
          resolve({
            jobId,
            status: randomStatus,
            progress: randomStatus === 'completed' ? 100 : Math.floor(Math.random() * 100)
          })
        }, 300)
      })
    }
  
    // 保存打印记录
    static async savePrintRecord(record) {
      // 这里应该是实际的API调用
      console.log('保存打印记录:', record)
      return { success: true }
    }
  }
  