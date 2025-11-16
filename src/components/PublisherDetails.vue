<!-- PublisherDetails.vue -->
<template>
  <div class="row">
   <div class="eleven column" style="margin-top: 5%">
    <h2>{{title}}</h2>
     <form>
     <div class="row">
      <div class="six columns">
       <label for="nameInput">Name</label>
       <input class="u-full-width" type="text"
         v-model="publisher.name">
      </div>
      <div class="six columns">
       <label for="countryInput">Country</label>
       <input class="u-full-width" type="text"
          v-model="publisher.country">
      </div>
     </div>
     <div class="row">
      <div class="six columns">
       <label for="foundedYearInput">Founded Year</label>
       <input class="u-full-width" type="number"
          v-model="publisher.foundedYear">
      </div>
     </div>
     <div class="row">
      <router-link class="button button-primary" 
        to="/publisher">Back</router-link>
       <a v-if='edit' class="button button-primary" style="float: right"
         v-on:click="updatePublisher(publisher.id)">Update</a>
       <a v-if='create' class="button button-primary" style="float: right"
         v-on:click="createPublisher()">Create</a>
     </div>
    </form>
  </div>
</div>
</template>

<script>
import { useRoute } from 'vue-router'

export default {
  name: "Publisher Details",
  props: ['show','edit','create'],
  data() {
    return {
      title: "Publisher Data",
      publisher: {}
    }
  },
  mounted() {
    const route = useRoute()
    if (route.params.id != null)
      this.findPublisher(route.params.id);
    else {
      this.publisher = {
        'id': Math.floor(Math.random()*100000000),
        'name':'',
        'country':'',
        'foundedYear':0
      };
    }
  },
  methods: {
    findPublisher: function(id) {
      fetch(this.url+'/.netlify/functions/publisherFind/'+id,
      { headers: {'Accept': 'application/json'}})
      .then((response) => response.json())
      .then((items) => {
       this.publisher = items[0];
      })
    },
    updatePublisher: function(id) {
      fetch(this.url+'/.netlify/functions/publisherUpdate/'+id,
        { headers: {'Content-Type':'application/json'},
          method: 'PUT',
          body: JSON.stringify(this.publisher)})
        .then((data) => {
          this.$router.push('/publisher');
        }
      )
    },
    createPublisher: function() {
      fetch(this.url+'/.netlify/functions/publisherInsert',
        { headers: {'Content-Type':'application/json'},
          method: 'POST',
          body: JSON.stringify(this.publisher)})
        .then((data) => {
           this.$router.push('/publisher');
        }
      )
    }
  }
};
</script>
