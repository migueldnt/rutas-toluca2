<template>
    <div class="info-ruta" :class="{show:hayRutaSeleccionada}">
        <div class="card">
            <div class="card-header">
                <div class="card-header-title">{{ rutaSeleccionada['NOMUT'] || 'Ruta no encontrada' }}</div>
                <div class="card-header-icon">
                    <button class="delete is-medium" @click="cerrar"></button>
                </div>
            </div>
            <div class="card-content" >
                <p v-if="!rutaSeleccionada['NOMUT'] || false">Ruta no encontrada</p>
                <div v-if="rutaSeleccionada['NOMUT'] || false">
                    <p>{{ rutaSeleccionada['NOMUT'] }}, {{ rutaSeleccionada['NOMDEL'] }}</p>
                    <p>Numero económico <b>{{ rutaSeleccionada['ECO'] }}</b></p>
                    <p>KM  <b>{{ rutaSeleccionada['KM'] / 1000 }}</b></p>
                    <p>Numero de paradas  <b>{{ rutaSeleccionada["NODOS"] }}</b></p>
                    <p><b>Horario</b></p>
                    <Horario :dias="diasValues"/>
                    <p>Entrada: <b>{{ rutaSeleccionada['ENTRADA'] }} hrs</b></p>
                    <p>Salida: <b>{{ rutaSeleccionada['SALIDA'] }} hrs</b></p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import useDelegacionStore from '../stores/delegacion';
import rutasLayer from "@/assets/data/RUTAS_N_01.json"
import Horario from './Horario.vue';
import { computed } from 'vue';

const delegacionStore = useDelegacionStore()

const diasCampos = ['LUNES','MARTES','MIERCOLES','JUEVES','VIERNES','SABADO','DOMINGO']

const hayRutaSeleccionada = computed(()=>{
    return delegacionStore.utbActual !== 'ALL'
})

const rutaSeleccionada = computed(()=>{
    const ruta = rutasLayer.features.find(f=>f.properties["CVEUT"]=== delegacionStore.utbActual)

    return ruta ? ruta.properties : {  }
})


const diasValues = computed(()=>{
    return Object.keys(rutaSeleccionada.value)
        .filter(key=>diasCampos.includes(key))
        .map(key=>rutaSeleccionada.value[key])
})

function cerrar(){
    delegacionStore.setUTBActual("ALL")
}
</script>



<style lang="scss">
.info-ruta{
    position: absolute;
    top: 10px;
    left: 50px;
    //right: 40px;
    z-index: 3;
    display: none;
    max-width: calc(100vw - 52px);

    &.show{
        display: block;
    }
}



</style>