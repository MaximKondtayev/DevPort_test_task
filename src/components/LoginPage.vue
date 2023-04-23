<template>
  <div class="wrapper">
    <div class="form">
      <div class="form__wrapper">
        <div class="form__header">
          <div class="header-title">
            Login
          </div>
        </div>
        <div class="form__main">
          <div class="main__description">
            Please fill in the following fields
          </div>
          <form action="">
            <div class="main__inputs">
              <div class="input__username">
                <input type="text" id="username" placeholder="Username" v-model="username" @keydown="onlyCharacters">
              </div>
              <div class="input__phone">
                <input type="tel" id="phone" placeholder="Phone Number" v-model="phone">
              </div>
              <div class="error">
                {{ errorMessage }}
              </div>
            </div>
            <div class="form__button" @click="submitHandler" :style="[errorMessage !== '' ? { 'margin' : '10px 0px 0px 0px' } : {'margin' : '20px 0px 0px 0px'} ]">
              Register
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
      username: '',
      phone: '',
      errorMessage: ''
    }
  },  
  computed: {
    ...mapGetters('users', ['getUsers'])
  },
  mounted() {
     this.fetchUsers()
  },
  methods: {
    ...mapActions('users', ['fetchUsers', 'fetchCurrentUser']),
    onlyCharacters(event) {
      // Allow only letters and spaces
      if (!/[a-zA-Z_.]/.test(event.key)) {
        event.preventDefault();
        this.errorMessage = 'Enter only characters, not numbers.'
      } else { 
         this.errorMessage = ''
      }
    },
    async submitHandler() {
      const user = this.getUsers.find(
        u => u.username === this.username && u.phone === this.phone
      );
      if (user) {
        this.errorMessage = ''
        localStorage.setItem('userData', JSON.stringify(user))
        this.$router.push({ name: 'todo' })
      } else {
        this.errorMessage = 'Login error'
      }
    }
  }
}
</script>

<style scoped>
  .wrapper {
    width: 100%;
    height: 100vh;
    background-color: #828282;
  }
  .form {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .form__wrapper {
    background: #C4C4C4;
    border-radius: 5px;
    width: 100%;
    max-width: 447px;
    height: 100%;
    max-height: 299px;
    margin: 15px;
  }
  .form__header {
    height: 100%;
    max-height: 51px;
    background: #A5A5A5;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .header-title {
    font-style: normal;
    font-size: 17px;
    line-height: 21px;
    color: #5F5F5F;
  }
  .form__main {
    padding: 15px 25px 25px 30px;
  }
  .main__description {
    text-align: start;
    font-style: normal;
    font-size: 15px;
    line-height: 21px;
    color: #5F5F5F;
    margin-bottom: 14px;
  }
  .main__input {
    width: 100%;
  }
  .main__inputs input {
    width: 100%;
    padding: 10px;
    height: 41px;
    box-sizing: border-box;
    background: #FFFFFF;
    border-radius: 5px;
    outline: none;
    border: none
  }
  .input__username {
    margin-bottom: 20px;
  }
  .main__inputs input {
    
  }
  .main__inputs input::placeholder {
    font-weight: 400;
    font-size: 17px;
    line-height: 21px;
    color: #353535;
  }
  .form__button {
    background: #519945;
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
  .error {
    margin-top: 10px;
    text-align: start;
    color: red;
  }
  
</style>