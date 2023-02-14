<template>
    <button class="button is-info is-small is-rounded" @click="regresar">
        <span class="material-symbols-outlined is-size-5">
                    home
        </span>
    </button>
</template>

<script setup>

import useDelegacionStore from "../stores/delegacion"

const delegacionStore = useDelegacionStore()

function regresar(){
    delegacionStore.setDelegacionActual("ALL")
}

</script>