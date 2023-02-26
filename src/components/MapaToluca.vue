<template>
    <div class="container-mapa">
        <div class="mapa" ref="mapa_div">
        </div>
        <div class="zona-flotante">
            <BotonRegresar />
        </div>

        <InfoRuta />

        <div class="logo-izquierdo">
            <img src="@/assets/logo_toluca.png">
            <img src="@/assets/escudo_toluca.png">
        </div>
    </div>

</template>

<script setup>
import BotonRegresar from "./BotonRegresar.vue"
import InfoRuta from "./InfoRuta.vue"
import { onMounted, ref, watch } from 'vue';
import Map from 'ol/Map.js';
import { Text as TextStyle, Fill, Stroke, Style, Circle } from 'ol/style.js';
import { OSM, Vector as VectorSource } from 'ol/source.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import View from 'ol/View.js';
import GeoJSON from 'ol/format/GeoJSON.js';



import useDelegacionStore from "../stores/delegacion"

import rutasLayer from "@/assets/data/RUTAS_N_01.json"
import paradasRutasLayer from "@/assets/data/Paradas_rutas_N.json"
import { computed } from "@vue/reactivity";


const delegacionStore = useDelegacionStore()

const mapa_div = ref(null)
let mapa_ol;


const styleDelegaciones = (feature)=>{
    const nomdel = feature.getProperties()["NOMDEL"]
    return new Style({
        stroke: new Stroke({
            color: "#7D1E6A",
            width: 3
        }),
        fill: new Fill({
            color: "transparent"
        }),
        text: new TextStyle({
            font: 'bold 12px Calibri,sans-serif',
            text:nomdel,
            fill: new Fill({color:"#000"}),
            stroke: new Stroke({color:"#fff",width:5})
        })
    })
}

let capa_delegaciones = new VectorLayer({
    source: new VectorSource({
        url: "DEL_N.json",
        format: new GeoJSON(),
    }),
    visible: true,
    style: styleDelegaciones
})
capa_delegaciones.set("name", "delegaciones")

const styleUtbs = (feature)=>{
    const nomdel = feature.getProperties()["NOMUT"]
    return new Style({
        stroke: new Stroke({
            color: "#7D1E6A",
            width: .5
        }),
        fill: new Fill({
            color: "transparent"
        }),
        text: new TextStyle({
            font: '12px Calibri,sans-serif',
            text:nomdel,
            fill: new Fill({color:"#000"}),
            stroke: new Stroke({color:"#fff",width:5})
        })
    })
}

let capa_utbs = new VectorLayer({
    source: new VectorSource({
        url: "UTB_N.json",
        format: new GeoJSON(),
    }),
    visible: true,
    style: styleUtbs
})
capa_delegaciones.set("name", "delegaciones")

//rutas

const styleRutas = (feature)=>{
    const resaltada = feature.get("resalta") === true

    return new Style({
        stroke: new Stroke({
            color: resaltada ? "#F73D93" : "#413F42",
            width: resaltada ? 4 : 2
        })
    })
}

let capa_rutas = new VectorLayer({
    source: new VectorSource({
        features: [],
    }),
    visible: false,
    style: styleRutas
})
capa_rutas.set("name", "rutas")


//paradas
const styleParadas = (feature)=>{
    const numero = feature.getProperties()["NUM"]
    return new Style({
        image: new Circle({
            fill: new Fill({color:"#00d1b2"}),
            stroke: new Stroke({color:'white',width:1}),
            radius: 10,
        }),
        text: new TextStyle({
            font: '10px Calibri,sans-serif',
            text:numero+"",
            fill: new Fill({color:"#000"}),
            stroke: new Stroke({color:"#fff",width:3}) 
        })
    })
}

let capa_paradas = new VectorLayer({
    source: new VectorSource({
        features: []
    }),
    visible: false,
    style:styleParadas
})
capa_paradas.set("name","paradas")

//las capas base

const capa_osm_normal = new TileLayer({
    source: new OSM(),
    visible:true
})

onMounted(() => {
    mapa_ol = new Map({
        target: mapa_div.value,
        layers: [
            capa_osm_normal,
            capa_utbs,
            capa_delegaciones, capa_rutas, capa_paradas
        ],
        view: new View({
            center: [-99.6532400, 19.2878600],
            zoom: 12,
            projection: "EPSG:4326"
        }),
    });

    mapa_ol.on("click", (evt) => {
        const pixel = evt.pixel
        capa_delegaciones.getFeatures(pixel).then((features) => {
            if(features.length>0 && delegacionActual.value === 'ALL'){
                const nodel = features[0].getProperties()["NODEL"]
                delegacionStore.setDelegacionActual(nodel)
            }
            
            //console.log(delegacionStore.delegacionActual)
        })
    })
    mapa_ol.on("pointermove", (evt) => {

        const hayDel = mapa_ol.hasFeatureAtPixel(evt.pixel, {
            layerFilter: (layer) => layer.get("name") === "delegaciones"            
        })

        if (hayDel) {
            mapa_div.value.style.cursor = "pointer"
        }else{
            mapa_div.value.style.cursor = "default"

        }

    })
})


const filtrarRutas = (nodel) => {
    if(nodel === 'ALL'){
        capa_rutas.setVisible(false)
        mapa_ol.getView().fit(capa_delegaciones.getSource().getExtent(), { duration: 1000 })
        return 
    }

    const nuevas_rutas = rutasLayer.features.filter(ruta => {
        return ruta.properties["NO_DEL"] === nodel
    })

    const geojson = { 'type': 'FeatureCollection', features: nuevas_rutas }

    capa_rutas.getSource().clear()
    capa_rutas.getSource().addFeatures(new GeoJSON().readFeatures(geojson))

    mapa_ol.getView().fit(capa_rutas.getSource().getExtent(), { duration: 1000 })
    capa_rutas.setVisible(true)
    delegacionStore.showColapsedPanel()
}

watch(() => delegacionStore.delegacionActual, (nodel) => {
    filtrarRutas(nodel)
})

watch(() => delegacionStore.utbActual, (cveut) => {
    resaltarRutas(cveut)
})

const delegacionActual = computed(()=>{
    return delegacionStore.delegacionActual
})

let rutaResaltada = undefined
function resaltarRutas(cveut){
    if(rutaResaltada){
        rutaResaltada.set("resalta",false)
    }
    if(cveut === 'ALL'){
        apagarParadas()
        return
    }
    const ruta = capa_rutas.getSource().getFeatures().find(f=>{
        return f.getProperties()['CVEUT'] === cveut;
    })
    
    if(ruta){
        ruta.set("resalta",true)
        mapa_ol.getView().fit(ruta.getGeometry().getExtent(),{duration:1000})
        rutaResaltada = ruta
        delegacionStore.hideColapsedPanel()
        resaltarParadas(ruta.getProperties()["CVRUTA"])
    }else{
        alert("No se encuentra una ruta que coincida con las claves: CVEUT = "+cveut+" y NODEL = "+delegacionActual.value)
    }

}

function resaltarParadas(cveruta){
    const paradas_json = paradasRutasLayer.features.filter(parada=>{
        return parada.properties["CVRUTA"] === cveruta
    })
    //console.log(cveruta,paradas_json)
    const geojson = { 'type': 'FeatureCollection', features: paradas_json }
    capa_paradas.getSource().clear()
    capa_paradas.getSource().addFeatures(new GeoJSON().readFeatures(geojson))
    capa_paradas.setVisible(true)

}
function apagarParadas(){
    capa_paradas.getSource().clear()
    capa_paradas.setVisible(false)
}

</script>


<style lang="scss" >
.container-mapa {
    position: relative;

    .mapa {
        width: 100%;
        height: 100%;
        .ol-zoom{
            top: 40px;
            button{
                width: 30px;
                height: 30px;
                background-color: hsl(207deg, 61%, 53%);
                color: white;
                font-weight: 600;
            }
        }
    }

    .zona-flotante {
        position: absolute;
        top: 120px;
        left: 0px;
        background-color: transparent;

    }

    .logo-izquierdo {
        position: absolute;
        left: 10px;
        bottom: 10px;
        height: 60px;

        img {
            max-height: 100%;
        }
    }
}
</style>