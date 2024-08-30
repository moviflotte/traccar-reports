<script lang="ts">
    import { Avatar, Dropdown, DropdownDivider, DropdownHeader, DropdownItem } from 'flowbite-svelte';

</script>

<button class="ms-3 rounded-full ring-gray-400 focus:ring-4 dark:ring-gray-600">
    <Avatar>avatar</Avatar>
</button>
<Dropdown placement="bottom-end">
    <DropdownHeader>
        <span class="block text-sm">name</span>
        <span class="block truncate text-sm font-medium">email</span>
    </DropdownHeader>
    <DropdownItem>Settings</DropdownItem>
    <DropdownDivider />
    <DropdownItem on:click={() => alert('logout')}>Sign out</DropdownItem>
</Dropdown>
