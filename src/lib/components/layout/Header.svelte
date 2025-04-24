<script lang="ts">
    import websiteLogo from '$assets/app-logo.svg'
    import {Button} from "$lib/components";
    import {getUserState} from "$lib/state/UserState.svelte";

    let userContext = getUserState();
    let {user} = $derived(userContext);
</script>

<header>
    <a href="/">
        <img class="logo" src={websiteLogo} alt="">
    </a>
    <nav>
        {#if !user}
            <ul>
                <li>
                    <Button isMenu={true} href="/register">Create Account</Button>
                </li>
                <li>
                    <Button isMenu={true} isSecondary={true} href="/login">Login</Button>
                </li>
            </ul>
        {:else}
            <ul>
                <li>
                    <p>{user.email}</p>
                </li>
                <li>
                    <Button isMenu={true} onclick={() => userContext.logout()}>Logout</Button>
                </li>
            </ul>
        {/if}
    </nav>
</header>

<style>
    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 4vw;
    }

    ul {
        display: flex;
        align-items: center;
        column-gap: 24px;
    }

    .logo {
        height: 72px;
    }


</style>