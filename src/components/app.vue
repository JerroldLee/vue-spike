<template>
<div>
  <h1>Latest Vue.js Commits</h1>
  <template v-for="branch in branches">
    <input type="radio"
      :id="branch"
      :value="branch"
      name="branch"
      v-model="currentBranch">
    <label :for="branch">{{ branch }}</label>
  </template>
  <p>vuejs/vue@{{ currentBranch }}</p>
  <div v-if="errorMessage">{{ errorMessage }}</div>
  <commits
    :current-branch="currentBranch"
    :api-url="apiUrl"
    :commits="commits">
  </commits>
</div>
</template>

<script>
import Commits from './commits.vue';

export default {
  components: {
    Commits
  }
}
</script>
