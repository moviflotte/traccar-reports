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
    export let data;
    let showExport = true
    let tbl
</script>

<svelte:window on:afterprint={showExport=true} />

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
<Table hoverable="true" >
    <TableHead class="border-y border-gray-200 bg-gray-100 dark:border-gray-700">
        {#each [$t('time'), $t('address'), $t('max allowed'), $t('max detected'), $t('duration'), 'Duration', 'Actions'] as title}
            <TableHeadCell class="text-center p-4 font-medium">{title}</TableHeadCell>
        {/each}
    </TableHead>
    <TableBody>
        {#each data.events as event}
            <TableBodyRow class="text-base">
                <TableBodyCell class="p-4">{new Date(event.fixTime).toLocaleString()}</TableBodyCell>
                <TableBodyCell class="text-center max-w-sm overflow-hidden truncate p-4 text-base font-normal text-gray-500 dark:text-gray-400 xl:max-w-xs">
                    {(event.names && event.names.join(',')) || ''}
                </TableBodyCell>

                <TableBodyCell class="text-center max-w-sm overflow-hidden truncate p-4 text-base font-normal text-gray-500 dark:text-gray-400 xl:max-w-xs">
                    {event.speed_limit}
                </TableBodyCell>
                <TableBodyCell class="text-center max-w-sm overflow-hidden truncate p-4 text-base font-normal text-gray-500 dark:text-gray-400 xl:max-w-xs">
                    {Math.round(event.maxSpeed * 1.852)}
                </TableBodyCell>
                <TableBodyCell class="text-center max-w-sm overflow-hidden truncate p-4 text-base font-normal text-gray-500 dark:text-gray-400 xl:max-w-xs">
                    {event.points.length > 1? new Date(event.eventTime).toISOString().substring(11, 19) : ''}
                </TableBodyCell>
                <TableBodyCell class="text-center max-w-sm overflow-hidden truncate p-4 text-base font-normal text-gray-500 dark:text-gray-400 xl:max-w-xs">
                    dist: {event.distance}
                </TableBodyCell>
                <TableBodyCell class="text-center max-w-sm overflow-hidden truncate p-4 text-base font-normal text-gray-500 dark:text-gray-400 xl:max-w-xs">
                    points: {event.points.length}
                </TableBodyCell>
                <TableBodyCell class="text-center max-w-sm overflow-hidden truncate p-4 text-base font-normal text-gray-500 dark:text-gray-400 xl:max-w-xs">
                    {event.way_id}
                </TableBodyCell>


                <TableBodyCell class="flex items-center space-x-6 whitespace-nowrap p-4  overflow-hidden truncate">
                    <div class="text-sm font-normal text-gray-500 dark:text-gray-400">
                        <div class="text-base font-semibold text-gray-900 dark:text-white">{event.speed_limit}</div>
                        <div class="text-sm font-normal text-gray-500 dark:text-gray-400">asd</div>
                    </div>
                </TableBodyCell>

                <TableBodyCell class="text-center max-w-sm overflow-hidden truncate p-4 text-base font-normal text-red-500 dark:text-gray-400 xl:max-w-xs">
                    {event.model}
                </TableBodyCell>

            </TableBodyRow>
        {/each}
    </TableBody>
</Table>
</div>

<style>
    @page {
        size: A4;
        margin: 5mm;
    }
</style>
