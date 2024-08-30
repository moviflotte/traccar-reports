<script>
    import { MultiSelect } from 'flowbite-svelte';

    let selected = [];
    let countries = [
        { value: 1, name: 'Device1' },
        { value: 2, name: 'Device2' },
        { value: 3, name: 'Device3' }
    ];
</script>

<MultiSelect placeholder="Select devices..." items={countries} bind:value={selected} size="lg"  />
