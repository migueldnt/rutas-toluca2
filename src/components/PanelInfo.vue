<template>
    <div class="panel is-primary panel-info">
        <div class="panel-heading">Delegaciones</div>
        <div class="panel-block">
            <p class="control has-icons-left">
                <input class="input is-primary" type="text" placeholder="Search" v-model="valorBusqueda">
                <span class="icon is-left">
                    <i class="fas fa-search" aria-hidden="true"></i>
                </span>
            </p>
        </div>
        <div class="panel-block is-active" v-for="del in delegacionesFiltro" >
            <a @click="delegacionStore.setDelegacionActual(del['NODEL'])">
                {{ del.NOMDEL }}
            </a>
            
        </div>
    </div>

</template>

<script setup>

import delegacionesLayer from "@/assets/DEL_N.json"
import { computed, ref } from "@vue/reactivity";
import useDelegacionStore from "../stores/delegacion"

const delegaciones = delegacionesLayer.features.map(f=>({NODEL:f.properties['NODEL'], NOMDEL:f.properties['NOMDEL']}))

const delegacionStore = useDelegacionStore()

const valorBusqueda = ref("")

const delegacionesFiltro = computed(()=>{
    if(valorBusqueda.value.length> 2){
        return delegaciones.filter(del => del['NOMDEL'].toLowerCase().includes(valorBusqueda.value.toLowerCase()) )
    }

    return delegaciones
})

</script>

<style>
.panel-info{
    overflow-y: auto;
}
</style>