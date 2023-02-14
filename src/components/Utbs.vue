<template>
    <div class="panel is-primary panel-info">
        <div class="panel-heading">UTBs</div>
        <div class="panel-block">
            <p class="control has-icons-left">
                <input class="input is-primary" type="text" placeholder="Search" v-model="valorBusqueda">
                <span class="icon is-left">
                    <span class="material-symbols-outlined">
                        search
                    </span>
                </span>
            </p>
        </div>
        <div class="panel-block">
            <button class="button" @click="delegacionStore.setDelegacionActual('ALL')">
                Regresar
            </button>

        </div>
        <div class="panel-block" v-for="utb in utbsFiltro" :key="utb['CVEUT']">
            <a @click="delegacionStore.setUTBActual(utb['CVEUT'])">
                {{ utb.NOMUT }}
            </a>

        </div>
    </div>
</template>


<script setup>

import utbsLayer from "@/assets/data/UTB_N.json";
import { computed, ref } from "@vue/reactivity";
import { watch } from "vue";
import useDelegacionStore from "../stores/delegacion"



const delegacionStore = useDelegacionStore()

let utbs = utbsLayer.features
    .map(f => ({ NODEL: f.properties['NODEL'],CVEUT: f.properties['CVEUT'], NOMUT: f.properties['NOMUT'] }))
    .filter(f=>f['NODEL'] === delegacionStore.delegacionActual)

const valorBusqueda = ref("")

const utbsFiltro = computed(() => {
    if (valorBusqueda.value.length > 2) {
        return utbs.filter(del => del['NOMUT'].toLowerCase().includes(valorBusqueda.value.toLowerCase()))
    }

    return utbs
})


watch(()=>delegacionStore.delegacionActual,(nodel)=>{

    utbs = utbsLayer.features
        .map(f => ({ NODEL: f.properties['NODEL'],CVEUT: f.properties['CVEUT'], NOMUT: f.properties['NOMUT'] }))
        .filter(f=>f['NODEL'] === nodel)
})
</script>

<style>
.panel-info {
    max-height: 100%;
    overflow-y: auto;
}
</style>