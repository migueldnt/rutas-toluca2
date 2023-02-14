<template>
    <div class="horario table-container">
        <table class="table is-bordered">
            <thead>
                <tr>
                    <th v-for=" dia in diasCampos">{{ dia.substring(0, 3) }}</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td v-for="dia in dias">
                        <span class="material-symbols-outlined has-text-primary" v-if="dia===0">
                            check_circle
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

</template>

<script setup>

const diasCampos = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO']

const props = defineProps({
    dias: {
        type: Array,
        default() {
            return []
        }
    }
})

</script>


<style>
.horario {
    display: flex;
    flex-direction: row;
}
</style>