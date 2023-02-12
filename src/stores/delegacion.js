import { defineStore } from 'pinia'
import { ref } from "vue"
import delegaciones from "@/assets/DEL_N.json"

const useDelegacionStore = defineStore('delegacion', {
    state() {
        return {
            delegacionActual: '00'
        }
    },
    actions: {
        setDelegacionActual(nodel) {
            this.delegacionActual = nodel
        }
    }


})

export default useDelegacionStore
//*