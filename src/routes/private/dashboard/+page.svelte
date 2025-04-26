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
    <BookCategory booksToDisplay={userContext.getHighestRatedBooks()} categoryName="Favorite books"/>
    <BookCategory booksToDisplay={userContext.getRecentlyAddedUnreadBooks()} categoryName="Recently added books"/>
    <BookCategory booksToDisplay={userContext.getBooksByFavoriteGenre()}
                  categoryName={`Favorite Genre: ${userContext.getFavoriteGenre()}`}/>
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
</style>