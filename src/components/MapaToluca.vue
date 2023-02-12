<template>
    <div class="container-mapa">
        <div class="mapa" ref="mapa_div">

        </div>
    </div>

</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import Map from 'ol/Map.js';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import View from 'ol/View.js';
import GeoJSON from 'ol/format/GeoJSON.js';



import useDelegacionStore from "../stores/delegacion"

import rutasLayer from "@/assets/RUTAS_N_01.json"


const delegacionStore  = useDelegacionStore()

const mapa_div = ref(null)
let mapa_ol;

let capa_delegaciones = new VectorLayer({
    source: new VectorSource({
        url: "DEL_N.json",
        format: new GeoJSON(),
    }),
    visible: true,
    style: new Style({
        stroke: new Stroke({
            color: "#3399CC",
            width: 3
        }),
        fill:new Fill({
            color: "transparent"
        })
    })
})


let capa_rutas = new VectorLayer({
    source: new VectorSource({
        features: [],
    }),
    visible: false,
    style: new Style({
        stroke: new Stroke({
            color: "#3d0000",
            width: 2
        })
    })
})

onMounted(() => {
    mapa_ol = new Map({
        target: mapa_div.value,
        layers: [
            new TileLayer({
                source: new OSM(),
            }),
            capa_delegaciones,capa_rutas
        ],
        view: new View({
            center: [-99.6532400,19.2878600],
            zoom: 12,
            projection:"EPSG:4326"
        }),
    });

    mapa_ol.on("click",(evt)=>{
        const pixel = evt.pixel
        capa_delegaciones.getFeatures(pixel).then((features)=>{
            const nodel = features[0].getProperties()["NODEL"]
            delegacionStore.setDelegacionActual(nodel)
            console.log(delegacionStore.delegacionActual)
        })
    })
})


const filtrarRutas=(nodel)=>{
    console.log(rutasLayer.features)
    const nuevas_rutas = rutasLayer.features.filter(ruta=>{
        return ruta.properties["NO_DEL"] === nodel
    })
    console.log(nodel)
    console.log(nuevas_rutas)
    const geojson = { 'type': 'FeatureCollection',features : nuevas_rutas }

    capa_rutas.getSource().clear()
    capa_rutas.getSource().addFeatures( new GeoJSON().readFeatures(geojson) )
    //mapa_ol.getView().fit(capa_rutas.getExtent())
    capa_rutas.setVisible(true)
    capa_delegaciones.setVisible(false)
}

watch(()=>delegacionStore.delegacionActual,(nodel)=>{
    
    filtrarRutas(nodel)
})

</script>


<style lang="scss">
.container-mapa {
    .mapa{
        width: 100%;
        height: 100%;
    }
}
</style>