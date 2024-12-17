<template>
  <div id="bpmn-container"></div>
</template>

<script>
import BpmnModeler from 'jeeplus-bpmn/lib/Modeler';
import flowableModdle from './static/js/flowable.json';
import './static/css/bpmn.css';
export default {
  data() {
    return {
      bpmnModeler: null,
      initXMLTemplate: `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="Definitions_0001" targetNamespace="http://bpmn.io/schema/bpmn"><bpmn:process id="Process_1734404108890" name="业务流程_1734404108890" isExecutable="true"><bpmn:startEvent id="Event_0iufxx4" name="开始" /></bpmn:process><bpmndi:BPMNDiagram id="BPMNDiagram_1"><bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1734404108890"><bpmndi:BPMNShape id="Event_0iufxx4_di" bpmnElement="Event_0iufxx4"><dc:Bounds x="332" y="182" width="36" height="36" /><bpmndi:BPMNLabel><dc:Bounds x="339" y="225" width="23" height="14" /></bpmndi:BPMNLabel></bpmndi:BPMNShape></bpmndi:BPMNPlane></bpmndi:BPMNDiagram></bpmn:definitions>` //my BPMN 2.0 xml
    };
  },
  mounted () {
      this.init()
  },
  methods: {
    init() {
      this.bpmnModeler = new BpmnModeler({
        container: '#bpmn-container',
        moddleExtensions: {
            flowable: flowableModdle
        }
      });

      this.bpmnModeler.importXML(this.initXMLTemplate, function (err) {
        if (err) {
          console.log('error rendering', err);
        } else {
          console.log('rendered');
        }
      });
    }
  }
};
</script>

<style>
#bpmn-container {
    height: 100vh;
    background: url('./static/img/bpmnBg.svg');
}
</style>
