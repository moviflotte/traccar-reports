<script lang="ts">
    import { Avatar, Dropdown, DropdownDivider, DropdownHeader, DropdownItem } from 'flowbite-svelte';
    import {session} from '$lib/store'
    import {logout} from '$lib'
    import {get} from "svelte/store";
    let {email, name} = get(session)
    const names = name && name.split(' ');
    const initials = names && names.map(n => n[0]).join('');
    let avatar = initials && initials.toUpperCase();

</script>

<button class="ms-3 rounded-full ring-gray-400 focus:ring-4 dark:ring-gray-600">
    <Avatar>{avatar}</Avatar>
</button>
<Dropdown placement="bottom-end">
    <DropdownHeader>
        <span class="block text-sm">{name}</span>
        <span class="block truncate text-sm font-medium">{email}</span>
    </DropdownHeader>
    <DropdownItem>Settings</DropdownItem>
    <DropdownDivider />
    <DropdownItem on:click={logout}>Sign out</DropdownItem>
</Dropdown>
