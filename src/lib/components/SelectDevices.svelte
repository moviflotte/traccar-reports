<script>
    import { MultiSelect } from 'flowbite-svelte';
    export let selected;
    export let devices;
    import {t} from '$lib/i18n'
</script>

<MultiSelect placeholder="{t('Select devices')}..." items={
    devices.sort((a, b) => a.name.localeCompare(b.name)).map(d => ({value: d.id, ...d}))
    } bind:value={selected} size="lg"
/>
