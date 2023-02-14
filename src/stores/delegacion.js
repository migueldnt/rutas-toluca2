import { defineStore } from 'pinia'
import { ref } from "vue"
//import delegaciones from "@/assets/data/DEL_N.json"

const useDelegacionStore = defineStore('delegacion', {
    state() {
        return {
            delegacionActual: 'ALL',
            utbActual:'ALL',
            panelColapsed:false
        }
    },
    actions: {
        setDelegacionActual(nodel) {
            this.delegacionActual = nodel
            this.utbActual = 'ALL'
        },
        setUTBActual(cveut){
            this.utbActual = cveut
        },
        toggleColapsedPanel(){
            this.panelColapsed = !this.panelColapsed
        }
    }


})

export default useDelegacionStore
//*