<script setup>
import MapaToluca from '../components/MapaToluca.vue';
import PanelInfo from '../components/PanelInfo.vue';
</script>

<template>
  
  <div class="home-view">
    <PanelInfo></PanelInfo>
    <MapaToluca />
  </div>
</template>


<style>
.home-view{
  width: 100vw;
  height: 100vh;
  
  display: grid;
  grid-template-columns: 300px 1fr;
  
}
</style>