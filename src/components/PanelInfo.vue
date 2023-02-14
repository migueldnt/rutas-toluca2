<template>

    <div class="is-flex is-flex-direction-column panel-container" :class="{'colapsed-panel':colapsado}">
        <div class="is-flex is-justify-content-space-between is-align-items-center">
            <div class="px-3 titulo">Rutas Toluca</div>
            <button class="boton-colapsar button is-info is-small" @click="colapsar">
                <span class="material-symbols-outlined">
                    {{colapsado? 'keyboard_double_arrow_right': 'keyboard_double_arrow_left'}}
                </span>
            </button>
        </div>
        <div class="is-flex-grow-1 height-maximo">
            <Delegaciones v-if="delegacionesVisibles" />
            <Utbs v-if="!delegacionesVisibles" />
        </div>
        
    </div>
</template>

<script setup>
import Delegaciones from './Delegaciones.vue';
import Utbs from './Utbs.vue';
import useDelegacionStore from "../stores/delegacion"
import { computed, ref } from 'vue';

const delegacionStore = useDelegacionStore();



const delegacionesVisibles = computed(() => {
    return delegacionStore.delegacionActual === 'ALL'
})

const colapsado = computed(()=>{
    return delegacionStore.panelColapsed
})

function colapsar(){
    delegacionStore.toggleColapsedPanel()
}

</script>

<style lang="scss">
.panel-container{
    max-height: 100vh;
    height: 100vh;
    &.colapsed-panel{
        width: 0px;
        position: relative;
        .titulo{
            display: none;
        }

        .boton-colapsar{
            position: absolute;
            top: 0px;
            left: 0px;
            z-index: 2
        }
    }
}

.height-maximo{
    max-height: 100%;
}
</style>