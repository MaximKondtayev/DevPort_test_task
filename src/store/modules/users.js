import axios from 'axios';

const state = {
  users: [],
  error: null,
};
const getters = {
  getUsers: state => state.users,
  getError: state => state.error,
};
const actions = {
  async fetchUsers({ commit }) {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/users');
      commit('setUsers', response.data);
      
    } catch (error) {
      commit('setError', error.message);
    }
  },
};
const mutations = {
  setUsers: (state, users) => (state.users = users),
  setError: (state, error) => (state.error = error),
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};