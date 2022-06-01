<template>
  <v-container class="fill-height">
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        sm="6"
        lg="4"
        xl="3"
        align="center"
      >
        <h1 class="my-8 text--secondary display-2 ">
          Planning Poker
        </h1>
        <router-view />
        <div class="mb-4 mt-4 overline">
          <span class="text--secondary">Created by </span>
          <a
            href="https://www.linkedin.com/in/mcoy-paco/"
            target="_blank"
            style="text-decoration: none"
          >
            Mcoy Paco
          </a>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  data () {
    return {
      //
    }
  }
}
</script>
