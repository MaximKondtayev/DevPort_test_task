<template>
  <div class="wrapper">
    <div class="todo">
        <div class="todo__title">
            Todo List
        </div>
        <div class="user-card">
            <div class="card__wrapper">
                <div class="card-title">
                    User Info:
                </div>
                <div class="user-name">
                    Name: {{ user.name }}
                </div>
                <div class="user-phone">
                    Phone: {{ user.phone }}
                </div>
                <div class="user-email">
                    Email: {{ user.email }}
                </div>
            </div>
        </div>
        <div class="todo__content">
            <div class="content-filters">
                <select v-model="filterByStatus" id="status">
                    <option value="all">All</option>
                    <option value="completed">Completed</option>
                    <option value="uncompleted">Uncompleted</option>
                    <option value="favorites">Favorites</option>
                </select>
                <select v-model="filterByUserId">
                    <option value="all">All Users</option>
                    <option v-for="userId in userIds" :key="userId" :value="userId">
                        {{ userId }}
                    </option>
                </select>
                <input type="text" v-model="searchQuery" placeholder="Search by title   ">
            </div>
            <div class="create-todo__title">
                Create todo:
            </div>
            <div class="create-todo">
                <input type="number" v-model="newTodo.userId" placeholder="User ID">
                <input type="text" v-model="newTodo.title" placeholder="Title">
                <button class="create-button" @click="addTodo">Add</button>
            </div>
            <ul class="todo-items">
                <li v-for="todo in filteredTodos" :key="todo.id">
                    <span :class="{ completed: todo.completed }">{{ todo.title }}</span>
                    <button v-if="!isFavorite(todo.id)" @click="addToFavorites(todo.id)" class="add-button">
                        Add to Favorites
                    </button>
                    <button v-if="isFavorite(todo.id)" @click="removeFromFavorites(todo.id)" class="remove-button">
                        Remove from Favorites
                    </button>
                </li>
            </ul>
        </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
    data() {
        return {
            user: null,
            filterByStatus: 'all',
            filterByUserId: 'all',
            searchQuery: '',
            newTodo: {
                userId: '',
                title: ''
            },
            todos: []
        }
    },
    computed: {
        ...mapGetters(['allTodos', 'userIds', 'favorites']),
        filteredTodos() {
            return this.allTodos
                .filter(todo => {
                    if (this.filterByStatus === 'completed') {
                        return todo.completed
                    } else if (this.filterByStatus === 'uncompleted') {
                        return !todo.completed
                    } else if (this.filterByStatus === 'favorites') {
                        return this.isFavorite(todo.id)
                    }
                    return true
                })
                .filter(todo => {
                    if (this.filterByUserId === 'all') {
                        return true
                    }
                    return todo.userId === parseInt(this.filterByUserId)
                })
                .filter(todo => {
                    return todo.title.toLowerCase().includes(this.searchQuery.toLowerCase())
                })
        }
    },
    created() {
        this.user = JSON.parse(localStorage.getItem('userData'))
        this.fetchTodos()
    },
    methods: {
        ...mapActions(['fetchTodos', 'createTodo', 'updateTodo', 'deleteTodo', 'addToDoToFavorites', 'removeToDoFromFavorites']),
        addTodo() {
            this.createTodo(this.newTodo).then(() => {
                this.newTodo = {
                    userId: '',
                    title: '',
                }
            })
        },
        isFavorite(todoId) {
            return this.favorites.includes(todoId)
        },
        addToFavorites(todoId) {
            this.addToDoToFavorites(todoId)
        },
        removeFromFavorites(todoId) {
            this.removeToDoFromFavorites(todoId)
        },
    }
    
}
</script>

<style scoped>
    .wrapper {
        width: 100%;
    }
    .todo {
        padding-bottom: 20px;
    }
    .todo__title {
        font-style: normal;
        font-size: 25px;
        line-height: 21px;
        color: white;
        padding-top: 20px;
    }
    .user-card {
        width: 100%;
        margin-top: 20px;
    }
    .card__wrapper {
        margin-right: 20px;
        margin-left: 20px;
        background: white;
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        align-items: start;
        padding: 10px;
    }
    .card-title {
        font-style: bold;
        font-weight: 700;
        font-size: 20px;
        line-height: 21px;
        color: black;
    }
    .todo__content {
        background-color: #C3C3C3;
        border-radius: 5px;
        margin: 20px;
        padding: 20px;
        height: auto;
    }
    .content-filters {
        display: flex;
        justify-content: start;
    }
    select {
        padding: 10px;
        height: 41px;
        box-sizing: border-box;
        background: #FFFFFF;
        border-radius: 5px;
        outline: none;
        border: none;
        width: 100%;
        max-width: 250px;
        margin-right: 20px;

    }
    input {
        box-sizing: border-box;
        background: #FFFFFF;
        border-radius: 5px;
        padding: 10px;
        outline: none;
        border: none;
        max-width: 250px;
        width: 100%;
    }
    .create-todo {
        margin-top: 20px;
        display: flex;
        justify-content: start;
    }
    .create-todo__title {
        margin-top: 20px;
        font-style: bold;
        font-weight: 700;
        font-size: 20px;
        line-height: 21px;
        color: black;
        text-align: start;
    }
    .create-todo input {
        margin-right: 20px;
    }
    .create-button {
        background: #519945;
        border: none;
        border-radius: 5px;
        padding-top: 10px;
        padding-bottom: 10px;
        color: #FFFFFF;
        font-style: normal;
        font-weight: 500;
        font-size: 17px;
        line-height: 21px;
        letter-spacing: -0.025em;
        cursor: pointer;
        max-width: 100px;
        width: 100%;
    }
    ul {
        padding-left: 0;
        max-height: 500px;
        overflow: auto;
    }
    .todo-items li {
        list-style-type: none;
        background-color: white;
        margin-bottom: 15px;
        padding: 10px;
        border-radius: 5px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        text-align: start;
    }
    .todo-items li span {
        padding-right: 10px;
    }
    .add-button {
        background: #519945;
        border: none;
        border-radius: 5px;
        padding-top: 10px;
        padding-bottom: 10px;
        color: #FFFFFF;
        font-style: normal;
        font-weight: 500;
        font-size: 17px;
        line-height: 21px;
        letter-spacing: -0.025em;
        cursor: pointer;
    }
    .remove-button {
        background: red;
        border: none;
        border-radius: 5px;
        padding-top: 10px;
        padding-bottom: 10px;
        color: #FFFFFF;
        font-style: normal;
        font-weight: 500;
        font-size: 17px;
        line-height: 21px;
        letter-spacing: -0.025em;
        cursor: pointer;
    }

    @media screen and (max-width: 435px)  {
        .create-button, .add-button, .remove-button {
            font-size: 13px;
        }
        .todo-items li span {
            overflow: hidden;
            max-width: 100px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }
    }
</style>