<script lang="ts">
    import {type Book, getUserState} from "$lib/state/user-state.svelte"
    import {Button, StarRating} from "$components";
    import Icon from "@iconify/svelte";

    interface BookPageProps {
        data: {
            book: Book
        };
    }


    let {data}: BookPageProps = $props();
    let userContext = getUserState();

    let book = $derived(userContext.getBookById(data.book.id) || data.book);
    let isEditMode = $state(false);

    let title = $state(book.title)
    let author = $state(book.author)
    let description = $state(book.description || "")
    let genre = $state(book.genre || "")

    function goBack() {
        history.back();
    }

    async function toggleEditModeAndSaveToDatabase() {
        if (isEditMode) {
            await userContext.updateBook(book.id, {title, author, description, genre})
        }
        isEditMode = !isEditMode;
    }

    async function updateReadingStatus() {
        const hasStartedReading = Boolean(book.started_reading);
        const currentTimestamp = new Date().toISOString();

        if (hasStartedReading) {
            await userContext.updateBook(book.id, {finished_reading: currentTimestamp})
        } else {
            await userContext.updateBook(book.id, {started_reading: currentTimestamp})
        }
    }

    async function updateDatabaseRating(newRating) {
        await userContext.updateBook(book.id, {rating: newRating})
    }

</script>

{#snippet actionButtons()}
    {#if !book.finished_reading}
        <Button onclick={updateReadingStatus} isSecondary={Boolean(book.started_reading)}>
            {book.started_reading ? "I finished reading it!" : "I started reading it!"}
        </Button>
    {/if}
{/snippet}

{#snippet bookInfo()}
    <h2 class="book-title mb-m">{book.title}</h2>
    <p class="book-author">{book.author}</p>
    <h4 class="mt-m mb-xs semi-bold">Your rating</h4>
    <StarRating value={book.rating || 0} {updateDatabaseRating}/>
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
    {@render actionButtons()}
    {#if book.genre}
        <h4 class="mt-m mb-xs semi-bold">Genre</h4>
        <p>{book.genre}</p>
    {/if}
{/snippet}


{#snippet editFields()}
    <form>
        <input class="input input-title mt-m mb-xs" bind:value={title} type="text" name="title"/>
        <div class="input-author">
            <p>by</p>
            <input class="input mt-m mb-xs" bind:value={author} type="text" name="author"/>
        </div>
        <h4 class="mt-m mb-xs semi-bold">Your rating</h4>
        <StarRating value={book.rating || 0} {updateDatabaseRating}/>
        <p class="small-font">Click to {book.rating ? "change" : "give"} the rating</p>
        <h4 class="mt-m mb-xs semi-bold">Description</h4>
        <textarea class="textarea mb-m" name="description" bind:value={description}
                  placeholder="Give a description of the book"></textarea>
    </form>
    {@render actionButtons()}
    <h4 class="mt-m mb-xs semi-bold">Genre</h4>
    <input class="input mt-m mb-xs" bind:value={genre} type="text" name="genre"/>
{/snippet}

<div class="book-page">
    <button onclick={goBack} aria-label="Go back">
        <Icon icon="ep:back" width="40"/>
    </button>
    <div class="book-container">
        <div class="book-info">
            {#if isEditMode}
                {@render editFields()}
            {:else}
                {@render bookInfo()}
            {/if}
            <div class="button-container mt-m">
                <Button isSecondary={true}
                        onclick={toggleEditModeAndSaveToDatabase}>{isEditMode ? "Save changes" : "Edit"}</Button>
                <Button isDanger={true} onclick={() => console.log("Toggle")}>Delete book from library</Button>
            </div>
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
        height: 600px;
        max-width: 450px;
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

    .input {
        padding: 8px 4px;
        width: 100%;
    }

    .textarea {
        width: 100%;
    }

    .input-title {
        font-size: 60px;
        font-family: "EB Garamond", serif;
        font-weight: bold;
    }

    .input-author {
        display: flex;
        align-items: center;
    }

    .input-author p {
        margin-right: 8px;
    }
</style>