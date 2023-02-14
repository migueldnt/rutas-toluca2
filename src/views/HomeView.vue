<script setup>
import MapaToluca from '../components/MapaToluca.vue';
import PanelInfo from '../components/PanelInfo.vue';
import useDelegacionStore from "../stores/delegacion"
import {computed} from "vue"

const delegacionStore = useDelegacionStore();

const colapsado = computed(()=>{
    return delegacionStore.panelColapsed
})
</script>

<template>
  
  <div class="home-view" :class="{'panel-colapsado':colapsado}">
    <PanelInfo></PanelInfo>
    <MapaToluca />
  </div>
</template>


<style lang="scss">
.home-view{
  width: 100vw;
  height: 100vh;
  
  display: grid;
  grid-template-columns: 300px 1fr;
  transition: all 500ms;

  &.panel-colapsado{
    grid-template-columns: 0px 1fr;
    
  }
  overflow-y: hidden;
  overflow-x: hidden;
  
}
</style>