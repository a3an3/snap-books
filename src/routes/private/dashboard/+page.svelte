<script lang="ts">
    import {getUserState} from "$lib/state/user-state.svelte.js";
    import Icon from "@iconify/svelte";
    import {BookCategory} from "$components";

    let userContext = getUserState();
    let {userName, allBooks} = $derived(userContext);

</script>

<div class="dashboard">
    <div class="dashboard-header mb-m">
        <a href="/private/scan-shelf" class="add-book">
            <Icon icon="icons8:plus" width="72" height="72"/>
            <p>Add books</p>
        </a>
        <div class="headline">
            <h3 class="bold mb-xs">Welcome back, {userName}.</h3>
            <p>There's nothing like the journey a good book can take you on. Have you discovered any new favorites
                recently?</p>
        </div>
    </div>
    {#if allBooks.length}
        {#if userContext.getHighestRatedBooks().length}
            <BookCategory booksToDisplay={userContext.getHighestRatedBooks()} categoryName="Favorite books"/>
        {/if}
        <BookCategory booksToDisplay={userContext.getRecentlyAddedUnreadBooks()} categoryName="Recently added books"/>
        {#if userContext.allBooks.filter((book) => book.genre).length === 0}
            <BookCategory booksToDisplay={userContext.getBooksByFavoriteGenre()}
                          categoryName={`Favorite Genre: ${userContext.getFavoriteGenre()}`}/>
        {/if}
    {:else}

        <a href="/private/scan-shelf" class="upload-hint mt-l">
            <h3>You have no books at your library at the moment. Click here to add books</h3>
            <div class="mt-m">
                <Icon icon="icons8:plus" width="72" height="72"/>
                <p>Add books</p>
            </div>
        </a>

    {/if}
</div>

<style>
    .dashboard-header {
        display: flex;
        justify-content: space-between;
        width: 100%;
    }

    .add-book {
        display: flex;
        align-items: center;
        text-decoration: none;
    }

    .add-book p {
        margin-left: 10px;
    }

    .headline {
        text-align: right;
        max-width: 30%;
        min-width: 300px;
    }

    .upload-hint {
        border: 1px solid grey;
        border-radius: 10px;
        padding: 30px 0;
        text-decoration: none;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .upload-hint div {
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>