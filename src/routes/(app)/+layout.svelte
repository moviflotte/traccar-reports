<script>
    import '../../app.css';
    import Navbar from './Navbar.svelte';
    import Sidebar from './Sidebar.svelte';
    let drawerHidden = false;

</script>

<header class="fixed top-0 z-40 mx-auto w-full flex-none border-b border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-800">
    <Navbar bind:drawerHidden />
</header>

<div class="flex min-h-full">
    <Sidebar bind:drawerHidden />
    <div class="min-h-full grow overflow-y-auto pt-[60px]">
        <div class="p-8 h-full">
            <slot />
        </div>
    </div>
</div>
