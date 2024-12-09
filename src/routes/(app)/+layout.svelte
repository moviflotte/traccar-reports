<script>
    import '../../app.css';
    import Navbar from './Navbar.svelte';
    import Sidebar from './Sidebar.svelte';
    let drawerHidden = false;

</script>

<div class="flex min-h-full">
    <Sidebar bind:drawerHidden />
    <div class="min-h-full grow overflow-y-auto pt-[60px]">
        <div class="p-8 h-full">
            <slot />
        </div>
    </div>
</div>
