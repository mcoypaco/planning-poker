<template>
  <v-row
    class="fill-height"
    align="center"
    justify="center"
  >
    <v-col
      cols="12"
      sm="6"
      lg="4"
      class="text-center"
    >
      <v-container>
        <h1 class="display-3">
          Error 4<span>&#9785;</span>4
        </h1>
        <div class="body-1 my-4 text-left">
          <p>Sorry, but the page you were trying to view does not exist.</p>
          <p>It looks like this was the result of either:</p>
          <ul>
            <li>a mistyped address</li>
            <li>an out-of-date link</li>
          </ul>
          <v-row>
            <v-spacer />
            <v-btn
              href="/"
              color="primary"
              text
              rounded
            >
              Back to home
            </v-btn>
          </v-row>
        </div>
      </v-container>
    </v-col>
  </v-row>
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
