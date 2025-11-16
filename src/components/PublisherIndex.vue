<!-- PublisherIndex.vue -->
<template>
  <div class="row">
   <div style="margin-top: 5%">
     <h2>{{title}}</h2>
     <table><thead>
       <tr>
         <th>Name</th>
        <th>Country</th>
        <th>Founded Year</th>
        <th class="text-center">Actions</th>
      </tr>
       </thead><tbody>
       <tr v-for='publisher in publishers'>
       <td>{{publisher.name}}</td>
       <td>{{publisher.country}}</td>
       <td>{{publisher.foundedYear}}</td>
       <td>
       <router-link class="button"
         :to="'/publisher/show/'+publisher.id">Show</router-link>
       &nbsp;
       <router-link class="button"
         :to="'/publisher/edit/'+publisher.id">Edit</router-link>
       &nbsp;
       <a class="button"
         v-on:click="deletePublisher(publisher.id)">Erase</a>
       </td>
       </tr></tbody>
     </table>
     <router-link class="button button-primary" 
       to="/publisher/create">New</router-link>
   </div>
  </div>
</template>

<script>

export default {
  name: "Publisher Index",
  data() {
    return {
      title: 'Publisher List',
      publishers: []
    };
  },
  mounted() {
    this.allPublishers()
  },
  methods: {
    allPublishers() {
      fetch(this.url+'/.netlify/functions/publisherFindAll',
        { headers: {'Accept': 'application/json'}})
        .then((response) => response.json())
        .then((items) => {
          this.publishers = items;
        })
     },
     deletePublisher(id) {
       fetch(this.url+'/.netlify/functions/publisherDelete/'+id,
         { headers: {'Content-Type': 'application/json'},
           method: 'DELETE'})
          .then((items) => {
            this.allPublishers();
          }
        )
     }
  }
};
</script>
