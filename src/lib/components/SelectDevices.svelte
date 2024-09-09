<script>
    import { MultiSelect } from 'flowbite-svelte';
    export let selected;
    export let devices;
</script>

<MultiSelect placeholder="Select devices..." items={devices.map(d => ({value: d.id, ...d}))} bind:value={selected} size="lg"  />
