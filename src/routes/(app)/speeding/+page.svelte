<script>
    import {Button, Heading, Toolbar} from "flowbite-svelte";
    import SelectDevices from "$lib/components/SelectDevices.svelte";
    import DatePicker from "$lib/components/DatePicker.svelte";
    import {getData} from "$lib/reports/speeding";
    let reportReady = false
    let start, end, selected, datePicker
    export let data
</script>

<Heading tag="h1" class="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
    Speeding Report
</Heading>
<Toolbar class="w-full py-4 text-gray-500 dark:text-gray-400" embedded>
    <div class="flex gap-4">
        <SelectDevices devices={data.devices} bind:selected="{selected}"/>
        <DatePicker bind:datePicker="{datePicker}"></DatePicker>
    </div>
    <div slot="end" class="space-x-2 pl-4">
        <Button class="whitespace-nowrap" on:click={async () => {
            const [start, end] = datePicker.getDates()
            if (selected && start && end) {
                await getData(selected, new Date(start).toISOString(), new Date(end).toISOString())
                reportReady = true
            } else {
                console.log(selected, start, end)
                alert('Please select devices and dates')
            }
        }}>Generate</Button>
    </div>
</Toolbar>

{#if reportReady}
    <iframe title="report" class="h-full w-full pb-4" src="/templates/speeding">
    </iframe>
{/if}
