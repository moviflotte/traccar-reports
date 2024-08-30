<script>
    import {Button, Heading, Toolbar} from "flowbite-svelte";
    import SelectDevices from "$lib/components/SelectDevices.svelte";
    import DatePicker from "$lib/components/DatePicker.svelte";
</script>


<Heading tag="h1" class="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
    Speeding
</Heading>
<Toolbar class="w-full py-4 text-gray-500 dark:text-gray-400" embedded>
    <div class="flex gap-4">
        <SelectDevices/>
        <DatePicker></DatePicker>
    </div>
    <div slot="end" class="space-x-2">
        <Button class="whitespace-nowrap" on:click={() => {}}>Generate</Button>
    </div>
</Toolbar>

