<script lang="ts">
    import type {Book} from "$lib/state/user-state.svelte"
    import {Button, StarRating} from "$components";
    import Icon from "@iconify/svelte";

    interface BookPageProps {
        data: {
            book: Book
        };
    }

    let {data}: BookPageProps = $props();

    let book = $derived(data.book);

    function goBack() {
        history.back();
    }

</script>


{#snippet bookInfo()}
    <h2 class="book-title mb-m">{book.title}</h2>
    <p class="book-author">{book.author}</p>
    <h4 class="mt-m mb-xs semi-bold">Your rating</h4>
    <StarRating value={book.rating || 0}/>
    <p class="small-font">Click to {book.rating ? "change" : "give"} the rating</p>
    {#if book.description}
        <h4 class="mt-m mb-xs semi-bold">
            Description
        </h4>
        <p class="mb-m">{book.description}</p>
    {:else}
        <h4 class="mt-m mb-xs semi-bold">
            No description yet
        </h4>
        <button class="block mb-m" onclick={() => console.log("Add")}>
            Click to add
        </button>
    {/if}

    {#if !book.finished_reading}
        <Button onclick={() => console.log("Update reading status")}>
            {book.finished_reading ? "I finished reading it!" : "I started reading it!"}
        </Button>
    {/if}
    {#if book.genre}
        <h4 class="mt-m mb-xs semi-bold">Genre</h4>
        <p>{book.genre}</p>
    {/if}
{/snippet}

<div class="book-page">
    <button onclick={goBack} aria-label="Go back">
        <Icon icon="ep:back" width="40"/>
    </button>
    <div class="book-container">
        <div class="book-info">
            {@render bookInfo()}
        </div>
        <div class="book-cover">
            {#if book.cover_image}
                <img src={book.cover_image} alt=""/>
            {:else}
                <button class="add-cover">
                    <Icon icon="bi:camera-fill" width="40"/>
                    Add cover image
                </button>
            {/if}
        </div>
    </div>
</div>


<style>
    .book-container {
        display: flex;
        justify-content: flex-start;
    }

    .book-info {
        width: 50%;
    }

    .book-cover {
        width: 40%;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid black;
        border-radius: 15px;
        min-height: 400px;
        max-width: 350px;
        margin-left: 80px;
    }

    .book-cover img {
        object-fit: cover;
        width: 100%;
        height: 100%;
        border-radius: inherit;
    }

    .add-cover {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
</style>