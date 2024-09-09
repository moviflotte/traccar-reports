<script>
    import {Button, Heading, Toolbar} from "flowbite-svelte";
    import SelectDevices from "$lib/components/SelectDevices.svelte";
    import DatePicker from "$lib/components/DatePicker.svelte";
    let reportReady = false
    export let data
</script>

<Heading tag="h1" class="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
    Speeding Report
</Heading>
<Toolbar class="w-full py-4 text-gray-500 dark:text-gray-400" embedded>
    <div class="flex gap-4">
        <SelectDevices devices={data.devices} />
        <DatePicker></DatePicker>
    </div>
    <div slot="end" class="space-x-2">
        <Button class="whitespace-nowrap" on:click={() => {reportReady = true}}>Generate</Button>
    </div>
</Toolbar>

{#if reportReady}
    <iframe title="report" class="h-full w-full pb-4" src="/templates/speeding">
    </iframe>
{/if}
