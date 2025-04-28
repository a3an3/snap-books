<script lang="ts">
    import {getUserState} from "$lib/state/user-state.svelte";
    import {Button} from "$components";

    let userContext = getUserState();
    let userName = $state(userContext.userName || "")
    let userEmail = $state(userContext.user?.email || "")

    let isEditMode = $state(false);

    let averageRating = $derived.by(() => {
        const booksWithRating = userContext.allBooks.filter((book) => book.rating);

        if (booksWithRating.length === 0) {
            return "No ratings yet";
        }

        const sumOfAllRatings = booksWithRating.reduce((acc, book) => acc + book.rating!, 0)
        const averageRating = Math.round(100 * (sumOfAllRatings / booksWithRating.length)) / 100;
        return averageRating.toString();
    });

    $effect(() => {
        if (userContext.userName) {
            userName = userContext.userName;
        }
    })

    async function toggleEditModeAndSaveToDatabase() {
        if (isEditMode) {
            await userContext.updateAccountData(userEmail, userName)
        }

        isEditMode = !isEditMode;
    }

    async function deleteAccount() {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete your account? This action cannot be undone and removes all of your data!"
        )

        if (confirmDelete) {
            await userContext.deleteAccount();
        }
    }
</script>

<div class="settings-page">
    <div class="settings-container">
        <h2>Settings</h2>

        <h5 class="mt-m mb-xs semi-bold">Username</h5>
        {#if isEditMode}
            <input type="text" name="userName" bind:value={userName}/>
        {:else}
            <h3>{userName}</h3>
        {/if}
        <h5 class="mt-m mb-xs semi-bold">Email</h5>
        {#if isEditMode}
            <input type="text" name="userEmail" bind:value={userEmail}/>
        {:else}
            <h3>{userEmail}</h3>
        {/if}
        <div class="button-container mt-l">
            <Button isSecondary={true} onclick={toggleEditModeAndSaveToDatabase}>
                {isEditMode ? "Save changes" : "Edit"}
            </Button>
            <Button isDanger={true} onclick={deleteAccount}>
                Delete account
            </Button>
        </div>
    </div>
    <div class="stats-container">
        <h5 class="semi-bold">
            Books in library
        </h5>
        <h3>{userContext.allBooks.length}</h3>
        <h5 class="semi-bold mt-m">Finished books</h5>
        <h3>{userContext.allBooks.filter((book) => Boolean(book.finished_reading)).length}</h3>
        <h5 class="semi-bold mt-m">Average rating given</h5>
        <h3>{averageRating}</h3>
    </div>
</div>

<style>
    .settings-page {
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
    }

    .button-container {
        display: flex;
        gap: 30px;
    }

    .settings-container {
        margin-right: 80px;
    }

    .settings-container input {
        width: 100%;
    }

    .stats-container {
        width: 300px;
        border-radius: 12px;
        padding: 8px 24px;
        background-color: rgba(255, 255, 255, 0.5);
        margin-bottom: 40px;
    }
</style>