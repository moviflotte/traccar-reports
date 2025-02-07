<script>
    import {Button, Toolbar, Spinner, Datepicker} from "flowbite-svelte";
    import SelectDevices from "$lib/components/SelectDevices.svelte";
    import {setAlert} from "$lib/store.js";
    import {t} from "$lib/i18n.js"
    let loadingReport = false
    let start, end, selected, datePicker
    export let data
    let reportLoaded = false
</script>
<div class="flex flex-col h-full">
<Toolbar class="w-full py-4 text-gray-500 dark:text-gray-400" embedded>
    <div class="flex p-4">
        <SelectDevices devices={data.devices} bind:selected="{selected}"/>
    </div>
    <div class="w-96 p-4">
        <Datepicker locale="{navigator.language}" range bind:rangeFrom={start} bind:rangeTo={end} bind:datePicker="{datePicker}"></Datepicker>
    </div>
    <div class="p-4">
        <Button class="whitespace-nowrap" on:click={async () => {
            loadingReport = false
            reportLoaded = false
            if (selected && selected.length && start && end) {
                setTimeout(() => loadingReport = true, 100)
            } else {
                setAlert('Please select devices and dates')
            }
        }}>
            {#if loadingReport}
                <Spinner class="me-3" size="4" color="white"/>
            {/if}
            {loadingReport?t('Carregando...'):t('Gerar')}
        </Button>
    </div>
</Toolbar>

{#if loadingReport || reportLoaded}
    <iframe on:load={() => {
        reportLoaded=true
        loadingReport=false
    }} title="report" class="flex-grow" src="{
    (() => {
        let endDate = new Date(endDate);
        endDate.setHours(23, 59, 59, 999);
        return `/reports/reports/speeding?start=${new Date(start).toISOString()}&end=${endDate.toISOString()}&selected=${selected}`;
    })()
}"></iframe>
{/if}
</div>
