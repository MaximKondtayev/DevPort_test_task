import axios from 'axios'

const apiUrl = 'https://jsonplaceholder.typicode.com/todos'

const state = {
  todos: [],
  filteredTodos: [],
  userIds: [],
  favorites: [],
  filter: {
    status: 'all',
    userId: 'all',
  },
  search: '',
}

const getters = {
  allTodos: state => state.todos,
  filteredTodos: state => state.filteredTodos,
  userIds: state => state.userIds,
  filter: state => state.filter,
  search: state => state.search,
  favorites: state => state.favorites
}

const actions = {
  async fetchTodos({ commit }) {
    const response = await axios.get(apiUrl)
    commit('setTodos', response.data)
    commit('setUserIds', response.data)
  },
  async createTodo({ commit }, todoData) {
    const response = await axios.post(apiUrl, todoData)
    commit('addTodo', response.data)
    return response.data
  },
  filterTodos({ commit, state }) {
    let filtered = state.todos
    if (state.filter.status !== 'all') {
      filtered = filtered.filter(todo => {
        if (state.filter.status === 'completed') {
          return todo.completed === true
        } else if (state.filter.status === 'uncompleted') {
          return todo.completed === false
        } else if (state.filter.status === 'favorites') {
          console.log(localStorage.getItem('favoriteTodoIds'))
          return localStorage.getItem('favoriteTodoIds') !== null
        }
      })
    }

    if (state.filter.userId !== 'all') {
      filtered = filtered.filter(todo => todo.userId == state.filter.userId)
    }

    if (state.search.length > 0) {
      filtered = filtered.filter(todo => {
        return todo.title.toLowerCase().includes(state.search.toLowerCase())
      })
    }

    commit('setFilteredTodos', filtered)
  },
  setSearch({ commit }, search) {
    commit('setSearch', search)
  },
  setFilter({ commit }, filter) {
    commit('setFilter', filter)
  },
  addToDoToFavorites({ commit }, id) {
    commit('addToDoToFavorites', id)
  },
  removeToDoFromFavorites({ commit }, id) {
    commit('removeToDoFromFavorites', id)
  },
}

const mutations = {
  setTodos: (state, todos) => (state.todos = todos),
  setUserIds: (state, todos) => {
    state.userIds = [...new Set(todos.map(todo => todo.userId))]
  },
  setFilteredTodos: (state, todos) => (state.filteredTodos = todos),
  setSearch: (state, search) => (state.search = search),
  setFilter: (state, filter) => (state.filter = filter),
  addToDoToFavorites: (state, id) => {
    state.favorites.push(id)
    localStorage.setItem('favoriteTodoIds', JSON.stringify(state.favorites))
  },
  removeToDoFromFavorites: (state, id) => {
    const index = state.favorites.indexOf(id)
    state.favorites.splice(index, 1)
    localStorage.setItem('favoriteTodoIds', JSON.stringify(state.favorites))
  },
  addTodo: (state, todo) => {
    state.todos.unshift(todo)
    state.filteredTodos.unshift(todo)
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
