<template>
  <ul>
    <commit v-for="commit in commits" :commit="commit"></commit>
  </ul>
</template>

<script>
import Commit from './commit.vue';

export default {
  props: ['currentBranch', 'apiUrl', 'commits'],

  watch: {
    currentBranch: 'fetchData'
  },

  components: {
    Commit
  },

  methods: {
    fetchData () {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', `${this.apiUrl}${this.currentBranch}`)
      window.history.pushState(null, null, `/${this.currentBranch}`);
      xhr.onload = () => {
        const response = JSON.parse(xhr.responseText);
        const errorMessage = response.message;
        const commits = errorMessage ? [] : response;
        this.commits = commits;
        this.errorMessage = errorMessage;
      };
      xhr.send();
    }
  }
}
</script>
