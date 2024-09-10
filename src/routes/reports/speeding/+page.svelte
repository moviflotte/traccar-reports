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
    import { FileChartBarSolid, FilePdfSolid} from "flowbite-svelte-icons";
    import { utils, writeFileXLSX } from 'xlsx';
    import SpeedLimitSign from "$lib/components/SpeedLimitSign.svelte";
    export let data;
    let showExport = true
    let tbl
</script>

<svelte:window on:afterprint={() => showExport=true} />

{#if showExport }
<Toolbar embedded class="w-full">
    <div slot="end" class="flex items-center space-x-2">
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

<Heading tag="h1" class="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl pb-4">
    Relatório de Excesso de Velocidade
</Heading>

<div bind:this={tbl}>
    <Table hoverable="true" class="table-fixed p-0">
    <TableHead class="border-y border-gray-200 bg-gray-100 dark:border-gray-700">
        <TableHeadCell class="text-center">{$t('time')}</TableHeadCell>
        <TableHeadCell class="text-center">{$t('address')}</TableHeadCell>
        <TableHeadCell class="text-center p-0 w-16">{$t('max allowed')}</TableHeadCell>
        <TableHeadCell class="text-center p-0 w-20">{$t('max detected')}</TableHeadCell>
        <TableHeadCell class="text-center">{$t('duration')}</TableHeadCell>
        <TableHeadCell class="text-right w-16">{$t('km')}</TableHeadCell>
    </TableHead>
    <TableBody>
        {#each data.events as event}
            <TableBodyRow class="text-xs">
                <TableBodyCell class="text-center overflow-hidden overflow-ellipsis p-0">
                    {new Date(event.fixTime).toLocaleString()}
                </TableBodyCell>
                <TableBodyCell class="p-0 text-center overflow-hidden overflow-ellipsis">
                    <a target="_blank" href="https://openstreetmap.org/way/{event.way_id}">{(event.names && event.names.join(',')) || ''}</a>
                </TableBodyCell>
                <TableBodyCell>
                    <SpeedLimitSign limit="{event.speed_limit}"/>
                </TableBodyCell>
                <TableBodyCell class="text-right">
                    {Math.round(event.maxSpeed * 1.852)}
                </TableBodyCell>
                <TableBodyCell class="text-center">
                    {event.points.length > 1? new Date(event.eventTime).toISOString().substring(11, 19) : ''}
                </TableBodyCell>
                <TableBodyCell class="text-right">
                    {event.points.length > 1 ? Math.round(event.distance) : ''}
                </TableBodyCell>
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
