<script>
    import {
        Button, Heading,
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell, Toolbar
    } from "flowbite-svelte";
    import { t } from "$lib/i18n";
    import {ExpandOutline, FileChartBarSolid, FilePdfSolid, MinimizeOutline} from "flowbite-svelte-icons";
    import { utils, writeFileXLSX } from 'xlsx';
    export let data;
    let showExport = true
    let tbl
    let maximized = false

    let columns = []

    if (data.positions.length) {
        columns = Object.keys(data.positions[0]).filter(k => k !== 'attributes')
        const keysSet = new Set();
        data.positions.forEach(position => {
            Object.keys(position.attributes).forEach(key => keysSet.add(key));
        });
        columns = columns.concat(Array.from(keysSet))
    }
    const getValue = (position, key) => position[key] || position.attributes[key]
</script>

<svelte:window on:afterprint={() => showExport=true} />

{#if showExport }
<Toolbar embedded class="w-full">
    <div slot="end" class="flex items-center space-x-1">
        <Button size="sm" color="alternative" class="gap-1 px-2" on:click={() => {
            if (maximized) {
                if (document.exitFullscreen) {
                    document.exitFullscreen()
                    maximized = false
                }
            }
            else {
                document.documentElement.requestFullscreen()
                maximized = true
            }
        }}>
            {#if maximized}
                <MinimizeOutline></MinimizeOutline>
            {:else}
                <ExpandOutline></ExpandOutline>
            {/if}
        </Button>
        <Button size="sm" color="alternative" class="gap-2 px-3" on:click={() => {
            showExport = false
            setTimeout(() => window.print(), 100)
        }}>
            <FilePdfSolid size="md" class="-ml-1"  />PDF
        </Button>
        <Button size="sm" color="alternative" class="gap-2 px-3" on:click={() => {
            const elt = tbl.getElementsByTagName("TABLE")[0];
            const wb = utils.table_to_book(elt);
            writeFileXLSX(wb, "speeding.xlsx");
        }}>
            <FileChartBarSolid size="md" class="-ml-1"  />Xlsx
        </Button>
    </div>
</Toolbar>
{/if}

<Heading tag="h1" class="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
    {t('Positions report')}
</Heading>
<div style="text-align-last: end">
    Total: {data.positions.length}
</div>
<div bind:this={tbl}>
    <Table hoverable="true">
    <TableHead class="border-y border-gray-200 bg-gray-100 dark:border-gray-700">
        {#each columns as key}
            <TableHeadCell class="text-center">{key}</TableHeadCell>
        {/each}
    </TableHead>
    <TableBody>
        {#each data.positions as position}
            <TableBodyRow>
                {#each columns as key}
                    <TableBodyCell class="text-center overflow-hidden overflow-ellipsis p-0.5" >
                        {#if key === 'latitude' || key === 'longitude'}
                            {getValue(position, key).toFixed(6)}
                        {:else if typeof getValue(position, key) === 'number'}
                            {Number.isInteger(getValue(position, key))
                                ? getValue(position, key)
                                : getValue(position, key).toFixed(2)}
                        {:else if key.endsWith('Time')}
                            {new Date(getValue(position, key)).toLocaleString()}
                        {:else}
                            {getValue(position, key) || '-'}
                        {/if}
                    </TableBodyCell>
                {/each}
            </TableBodyRow>
        {/each}
    </TableBody>
</Table>
</div>

<style>
    @page {
        size: A4 landscape;
        margin: 5mm;
    }
    div {
        print-color-adjust: exact;
    }
</style>
