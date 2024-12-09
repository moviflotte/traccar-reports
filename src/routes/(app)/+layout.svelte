<script>
    import '../../app.css';
    import Sidebar from './Sidebar.svelte';
    let drawerHidden = false;

</script>

<div class="flex min-h-full">
    <Sidebar bind:drawerHidden />
    <div class="min-h-full grow overflow-y-auto">
        <div class="p-8 h-full">
            <slot />
        </div>
    </div>
</div>
