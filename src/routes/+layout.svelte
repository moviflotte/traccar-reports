<script>import "../app.css";
import {Alert} from "flowbite-svelte";
import {alert, error, clearAlert, clearError} from '$lib/store'
import {InfoCircleSolid} from "flowbite-svelte-icons";

let errorMessage = '';
let alertMessage = '';

const unsubscribe = error.subscribe(value => {
    errorMessage = value;
    if (value) {
        setTimeout(() => {
            clearError();
        }, 5000);
    }
});

const unsubscribeAlert = alert.subscribe(value => {
    alertMessage = value;
    if (value) {
        setTimeout(() => {
            clearAlert();
        }, 5000);
    }
});

</script>

<slot></slot>
{#if alertMessage}
    <div class="fixed top-5 left-1/2 transform -translate-x-1/2 z-50">
        <Alert border>
            <InfoCircleSolid slot="icon" class="w-5 h-5" />
            <span class="font-medium">{alertMessage}</span>
        </Alert>
    </div>
{/if}
