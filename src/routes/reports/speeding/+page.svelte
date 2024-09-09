<script>
    import {
        Button, Heading,
        Indicator,
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell, Toolbar
    } from "flowbite-svelte";
    import {DownloadSolid} from "flowbite-svelte-icons";
    export let data;
    let showExport = true
</script>

<svelte:window on:afterprint={showExport=true} />

<Heading tag="h1" class="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl pb-10">
    Relatório de Excesso de Velocidade
</Heading>

{#if showExport }
<Toolbar embedded class="w-full py-4 text-gray-500  dark:text-gray-400 p-4">
    <div slot="end" class="flex items-center space-x-2">
        <Button size="sm" color="alternative" class="gap-2 px-3" on:click={() => {
            showExport = false
            setTimeout(() => window.print(), 100)
        }}>
            <DownloadSolid size="md" class="-ml-1"  />Export
        </Button>
    </div>
</Toolbar>
{/if}

<Table hoverable="true" >
    <TableHead class="border-y border-gray-200 bg-gray-100 dark:border-gray-700">
        <TableHeadCell class="p-4 font-medium">Name</TableHeadCell>
        {#each ['Phone', 'Model', 'Last Update', 'Status', 'Actions'] as title}
            <TableHeadCell class="text-center p-4 font-medium">{title}</TableHeadCell>
        {/each}
    </TableHead>
    <TableBody>
        {#each data.events as device}
            <TableBodyRow class="text-base">
                <TableBodyCell class="max-w-64 flex items-center space-x-6 whitespace-nowrap p-4  overflow-hidden truncate">
                    <div class="text-sm font-normal text-gray-500 dark:text-gray-400">
                        <div class="text-base font-semibold text-gray-900 dark:text-white">{device.name}</div>
                        <div class="text-sm font-normal text-gray-500 dark:text-gray-400">{device.uniqueId}</div>
                    </div>
                </TableBodyCell>
                <TableBodyCell class="text-center max-w-sm overflow-hidden truncate p-4 text-base font-normal text-gray-500 dark:text-gray-400 xl:max-w-xs">
                    {device.phone}
                </TableBodyCell>
                <TableBodyCell class="text-center max-w-sm overflow-hidden truncate p-4 text-base font-normal text-red-500 dark:text-gray-400 xl:max-w-xs">
                    {device.model}
                </TableBodyCell>
                <TableBodyCell class="p-4">{new Date(device.lastUpdate).toLocaleString()}</TableBodyCell>
                <TableBodyCell class="p-4 font-normal">
                    <div class="flex items-center gap-2">
                        <Indicator color={device.status === 'Active' ? 'green' : 'red'} />
                        {device.status}
                    </div>
                </TableBodyCell>
            </TableBodyRow>
        {/each}
    </TableBody>
</Table>
