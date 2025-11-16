Acceso a Redis mediante funciones
Para acceder a funciones AWS Lambda desde Netlify basta con escribirlas bajo un directorio /netlify/functions del repositorio.

Se requiere utilizar un archivo en donde esté definida la conexión a la base de datos de Redis. Esta especificación se almacenará en el archivo /netlify/functions/redisDB.js


"use strict";

const Redis = require('ioredis');
const client = new Redis({
  host:process.env.REDIS_HOST, 
  port:process.env.REDIS_PORT,
  password:process.env.REDIS_PSW});
module.exports = client;
Para poder acceder a este backend desde un frontend en una dirección diferente es necesario definir la autorización tipo CORS (Intercambio de Recursos de Origen Cruzado), esto se realiza en el archivo /netlify/functions/headersCORS.js


"use strict";

  // To enable CORS

module.exports =  {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'content-type',
  'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS'
};
Inicializando la base de datos
Para agregar datos a la base de datos se puede crear una función tal como lo muestra el siguiente código que reside en la dirección /netlify/functions/dbCreate.js


"use strict"

const redis = require('./redisDB');
const headers = require('./headersCORS');

function toJson(item, index, arr) {
  arr[index] = JSON.parse(item);
}

const books = [
  {
    "id": 1,
    "title": "Operating System Concepts",
    "edition": "9th",
    "copyright": 2012,
    "language": "ENGLISH",
    "pages": 976,
    "author": "Abraham Silberschatz",
    "publisher": "John Wiley & Sons"
  },
  {
    "id": 2,
    "title": "Database System Concepts",
    "edition": "6th",
    "copyright": 2010,
    "language": "ENGLISH",
    "pages": 1376,
    "author": "Abraham Silberschatz",
    "publisher": "John Wiley & Sons"
  },
  {
    "id": 3,
    "title": "Computer Networks",
    "edition": "5th",
    "copyright": 2010,
    "language": "ENGLISH",
    "pages": 960,
    "author": "Andrew S. Tanenbaum",
    "publisher": "Pearson Education"
  },
  {
    "id": 4,
    "title": "Modern Operating Systems",
    "edition": "4th",
    "copyright": 2014,
    "language": "ENGLISH",
    "pages": 1136,
    "author": "Andrew S. Tanenbaum",
    "publisher": "Pearson Education"
  }
];

exports.handler = async (event, context) => {

  if (event.httpMethod == "OPTIONS") {
    return { statusCode: 200, headers, body: "OK" };
  }

  try {
    
    redis.on("connect", function() {
      console.log("You are now connected");
    });

	 const n = books.length;
		
   for(let i = 1; i<=n; i++)
     await redis.set('book_'+i,JSON.stringify(books[i-1]));
	 
   await redis.set('book_N',n);
    
   return { statusCode: 200, headers, body: 'OK'};
  } catch (error) {
    console.log(error);
    return { statusCode: 400, headers, body: JSON.stringify(error) };
  }
};
En este caso book_N es un contador que permite llevar la cantidad de registros que se agregan.

Consulta de registros
Para consultar todos los datos referentes a books se puede utilizar el siguiente código, almacenado en el archivo /netlify/functions/bookFindAll.js. Nótese que se requiere verificar el método OPTIONS pues algunos frameworks tales como Angular, React y Vue envían una consulta preliminar utilizando este método para verificar las opciones CORS.


"use strict"

const redis = require('./redisDB');
const headers = require('./headersCORS');

function toJson(item, index, arr) {
  arr[index] = JSON.parse(item);
}

exports.handler = async (event, context) => {

  if (event.httpMethod == "OPTIONS") {
    return { statusCode: 200, headers, body: "OK" };
  }

  try {
    
    redis.on("connect", function() {
      console.log("You are now connected");
    });
   
   let keys = [];
   let n = await redis.get('book_N');

   for(let i = 1; i<=n; i++)
     keys.push('book_'+i);

   const books = await redis.mget(keys);
 
   books.forEach(toJson);

    return { statusCode: 200, headers, body: JSON.stringify(books)};
  } catch (error) {
    console.log(error);
    return { statusCode: 400, headers, body: JSON.stringify(error) };
  }
};
Para acceder a un registro particular se utilizará el siguiente código, almacenado en el archivo /netlify/functions/bookFind.js. Aquí es necesario obtener el id del libro desde el URL, esto se hace analizando el path del servicio disponible en la variable event.path.


"use strict"

const redis = require('./redisDB');
const headers = require('./headersCORS');

function toJson(item, index, arr) {
  arr[index] = JSON.parse(item);
}

exports.handler = async (event, context) => {

  if (event.httpMethod == "OPTIONS") {
    return { statusCode: 200, headers, body: "OK" };
  }

  try {
    
    const id = event.path.split("/").reverse()[0];
    
    redis.on("connect", function() {
      console.log("You are now connected");
    });

   const book = await redis.get('book_'+id);
   let books = [];
   books.push(book);
   books.forEach(toJson);

    return { statusCode: 200, headers, body: JSON.stringify(books)};
  } catch (error) {
    console.log(error);
    return { statusCode: 400, headers, body: JSON.stringify(error) };
  }
};
Actualización de registros
La función que permite modificar la información de un registro se encuentra almacenado en el archivo /netlify/functions/bookUpdate.js. En este caso también es necesario obtener el id del libro desde el URL.


"use strict"

const redis = require('./redisDB');
const headers = require('./headersCORS');

exports.handler = async (event, context) => {

  if (event.httpMethod == "OPTIONS") {
    return { statusCode: 200, headers, body: "OK" };
  }

  try {

    const id = event.path.split("/").reverse()[0];

    redis.on("connect", function() {
      console.log("You are now connected");
    });

   await redis.set('book_'+id,event.body);
   return { statusCode: 200, headers, body: 'OK'};
  } catch (error) {
    console.log(error);
    return { statusCode: 400, headers, body: JSON.stringify(error) };
  }
};
Creación de registros
La función para crear un nuevo registro de datos se encuentra almacenada en el archivo /netlify/functions/bookInsert.js.


"use strict"

const redis = require('./redisDB');
const headers = require('./headersCORS');

function toJson(item, index, arr) {
  arr[index] = JSON.parse(item);
}

exports.handler = async (event, context) => {

  if (event.httpMethod == "OPTIONS") {
    return { statusCode: 200, headers, body: "OK" };
  }

  try {
    
    redis.on("connect", function() {
      console.log("You are now connected");
    });
   
   const data = JSON.parse(event.body);

   await redis.put(data.id,event.body);
   return { statusCode: 200, headers, body: 'OK'};
  } catch (error) {
    console.log(error);
    return { statusCode: 400, headers, body: JSON.stringify(error) };
  }
};
Borrado de registros
La última función es la que permite eliminar un registro y se encuentra almacenada en el archivo /netlify/functions/bookDelete.js


"use strict"

const redis = require('./redisDB');
const headers = require('./headersCORS');

exports.handler = async (event, context) => {

  if (event.httpMethod == "OPTIONS") {
    return { statusCode: 200, headers, body: "OK" };
  }

  try {
    
    redis.on("connect", function() {
      console.log("You are now connected");
    });
    
    const id = event.path.split("/").reverse()[0];

    await redis.del('book_'+id);
    await redis.decr('book_N');

    return { statusCode: 200, headers, body: 'OK'};
  } catch (error) {
    console.log(error);
    return { statusCode: 422, headers, body: JSON.stringify(error) };
  }
};
Publicación del backend
El código de esta aplicación puede almacenarse en un repositorio de Github o Bitbucket y luego publicarse mediante Netlify. En este caso es necesario contar con un archivo sencillo /package.json que permita a Netlify la compilación del código. Dicho archivo luciría de la siguiente forma:


{
  "name": "redisDB-project",
  "dependencies": {
    "ioredis": "latest"
  }
}
Es necesario guardar en una variable de ambiente de Netlify el password del usuario de la base de datos (que es diferente al usuario del sitio de Redis.com). Eso se hace en la sección Build & deploy > environment > Environment variables. Se debe crear una variable llamada REDIS_PSW y allí escribir el password que se presenta en el sitio de Redis.com. Adicionalmente se debe crear una variable para especificar la dirección del host de redis, llamada REDIS_HOST y cuyo valor también se encuentra definido en Redis.com.

Una vez que se ha asociado el repositorio con el sitio de Netlify las funciones se pueden invocar y su ejecución se puede monitorear a través de la opción Functions del menú en dicho sitio.

El frontend
En este tutorial, el frontend de la aplicación se desarrollará mediante el framework Vue.js 3, más especificamente utilizando el ambiente Vite.js. Vite (palabra francesa que significa "rápido", se pronuncia /vit/, como "veet") es una herramienta de compilación que tiene como objetivo proporcionar una experiencia de desarrollo más rápida y sencilla para los proyectos web modernos.

Configuración de Vite
Para configurar Vite basta con crear un archivo llamado /vite.config.js en el directorio o repositorio del frontend.


import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()]
})
El archivo de configuración de módulos, llamado /package.json, sería el siguiente:


{
  "name": "vite-project",
  "version": "0.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "serve": "vite preview"
  },
  "dependencies": {
    "vue": "^3.2.16",
    "vue-router": "^4.0.12"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^1.9.3",
    "vite": "^2.6.4",
	  "ioredis": "latest"
  }
}
Nótese que se ha incluido el módulo de ioredis dentro de las dependencias, esto es porque así lo necesitan las funciones del backend, el frontend realmente no lo utiliza.

Ahora, para instalar los diferentes módulos en este directorio basta con ejecutar:

$ npm install

Página inicial
La página HTML inicial, llamada /index.html, únicamente invoca a la librería *main.js que utilizada por Vue. Su código sería el siguiente:


<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Bookstore App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
El archivo /src/main.js se encarga de inicializar algunos módulos y declarar variables globales:


import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import './assets/css/normalize.css';
import './assets/css/skeleton.css';

const app = createApp(App);
  
app.config.globalProperties.url = 'https://redis-una.netlify.app';

app.use(router).mount("#app");
Nótese que aquí se declara el URL del backend de la aplicación. Usted debe sustituirlo con la dirección de su propio sitio.

El archivo /src/router.js define los diferentes URLs de las opciones de la aplicación tal como se muestra a continuación:


import { createRouter, createWebHistory } from "vue-router";
import Home from "./components/Home.vue";
import BookIndex from "./components/BookIndex.vue";
import BookDetails from "./components/BookDetails.vue";

const routes = [
  { path: "/", component: Home },

  { path: "/book", component: BookIndex },
  { path: "/book/show/:id", 
    component: BookDetails, props: {show:true} },
  { path: "/book/edit/:id", 
    component: BookDetails, props: {edit:true} },
  { path: "/book/create", 
    component: BookDetails, props: {create:true} },
  { path: "/book/delete/:id", 
    component: BookDetails, props: {delete:true} },
];

const history = createWebHistory();

const router = createRouter({
  history,
  routes,
});

export default router;
Nótese que únicamente se han definido las operaciones que se aplican a los libros, aún falta definir las referentes a autores y editoriales. Además se puede ver que los componentes Home, BookIndex y BookDetails son importadas en este archivo.

Otro archivo necesario es /src/App.vue que se encarga de definir el contenido general que aparecerá en todas las páginas de la aplicación. El único contenido que cambia es el que se define en la etiqueta router-vie.


<template>
<div id="app" class="container">
  <div class="row"  style="margin-top: 15px">
    <router-link class="three columns button button-primary" 
      to="/">Home</router-link>
    <router-link class="three columns button button-primary" 
      to="/book">Books</router-link>
    <router-link class="three columns button button-primary" 
      to="/author">Authors</router-link>
    <router-link class="three columns button button-primary" 
      to="/publisher">Publishers</router-link>
  </div>
 <router-view />
  <div class="row">
    <button disabled="disabled" class="twelve columns button-primary">
      Copyright (c) 2022 - Armando Arce-Orozco
    </button>
  </div>
</div>
</template>

<script>
export default {
  name: "App",
};
</script>
El componente inicial que reside en el archivo /src/components/Home.vue presenta un mensaje general y cuenta con enlaces a las diferentes secciones (iguales al menú general)


<!-- Home.vue -->
<template>
  <div>
    <h2 style="margin-top: 15px">Bookstore Example Site</h2>
      <p>This website offers information on books, authors and publishers.</p>
    <ul>
      <li><router-link to='/book'>Books information</router-link></li>
      <li><router-link to='/author'>Authors information</router-link></li>
      <li><router-link to='/publisher'>Publishers information</router-link></li>
    </ul>
  </div>
</template>
La lista general de libros
El componente que reside en el archivo /src/components/BookIndex.vue recupera y muestra la lista general de libros. Este componente cuenta con dos métodos: allBooks y deleteBook, que se encargan de recuperar desde el backend la lista de libros y de eliminar un registro en el backend (respectivamente).


<!-- BookIndex.vue -->
<template>
  <div class="row">
   <div style="margin-top: 5%">
     <h2>{{title}}</h2>
     <table><thead>
       <tr>
         <th>Title</th>
        <th>Autor</th>
        <th>Publisher</th>
        <th>Edition</th>
        <th class="text-center">Actions</th>
      </tr>
       </thead><tbody>
       <tr v-for='book in books'>
       <td>{{book.title}}</td>
       <td>{{book.author}}</td>
       <td>{{book.publisher}}</td>
       <td>{{book.edition}}</td>
       <td>
       <router-link class="button"
         :to="'/book/show/'+book.id">Show</router-link>
       &nbsp;
       <router-link class="button"
         :to="'/book/edit/'+book.id">Edit</router-link>
       &nbsp;
       <a class="button"
         v-on:click="deleteBook(book.id)">Erase</a>
       </td>
       </tr></tbody>
     </table>
     <router-link class="button button-primary" 
       to="/book/create">New</router-link>
   </div>
  </div>
</template>

<script>

export default {
  name: "Book Index",
  data() {
    return {
      title: 'Book List',
      books: []
    };
  },
  mounted() {
    this.allBooks()
  },
  methods: {
    allBooks() {
      fetch(this.url+'/.netlify/functions/bookFindAll',
        { headers: {'Accept': 'application/json'}})
        .then((response) => response.json())
        .then((items) => {
          this.books = items;
        })
     },
     deleteBook(id) {
       fetch(this.url+'/.netlify/functions/bookDelete/'+id,
         { headers: {'Content-Type': 'application/json'},
           method: 'DELETE'})
          .then((items) => {
            this.allBooks();
          }
        )
     }
  }
};
</script>
Manejo de datos de libros
El componente que reside en el archivo /src/components/BookDetails.vue se encarga de realizar las operaciones de desplegar, modificar y crear nuevos registros.


<!-- BookDetails.vue -->
<template>
  <div class="row">
   <div class="eleven column" style="margin-top: 5%">
    <h2>{{title}}</h2>
     <form>
     <div class="row">
      <div class="six columns">
       <label for="titleInput">Title</label>
       <input class="u-full-width" type="text"
         v-model="book.title">
      </div>
      <div class="six columns">
       <label for="authorInput">Author</label>
       <input class="u-full-width" type="text"
          v-model="book.author">
      </div>
     </div>
     <div class="row">
      <div class="six columns">
       <label for="publisherInput">Publisher</label>
       <input class="u-full-width" type="text"
          v-model="book.publisher">
      </div>
      <div class="six columns">
       <label for="editionInput">Edition</label>
       <input class="u-full-width" type="text"
         v-model="book.edition">
      </div>
     </div>
     <div class="row">
      <div class="six columns">
       <label for="copyrightInput">Copyright</label>
       <input class="u-full-width" type="number"
          v-model="book.copyright">
      </div>
      <div class="six columns">
       <label for="languageInput">Language</label>
       <input class="u-full-width" type="text"
         v-model="book.language">
      </div>
     </div>
     <div class="row">
      <router-link class="button button-primary" 
        to="/book">Back</router-link>
       <a v-if='edit' class="button button-primary" style="float: right"
         v-on:click="updateBook(book.id)">Update</a>
       <a v-if='create' class="button button-primary" style="float: right"
         v-on:click="createBook()">Create</a>
     </div>
    </form>
  </div>
</div>
</template>

<script>
import { useRoute } from 'vue-router'

export default {
  name: "Book Details",
  props: ['show','edit','create'],
  data() {
    return {
      title: "Book Data",
      book: {}
    }
  },
  mounted() {
    const route = useRoute()
    if (route.params.id != null)
      this.findBook(route.params.id);
    else {
      this.book = {
        'id': 'book_'+Math.floor(Math.random()*100000000),'title':'','edition':'',
        'copyright':0,'language':'','pages':0,'author':'','author_id':0,
        'publisher':'','publisher_id':0 };
    }
  },
  methods: {
    findBook: function(id) {
      fetch(this.url+'/.netlify/functions/bookFind/'+id,
      { headers: {'Accept': 'application/json'}})
      .then((response) => response.json())
      .then((items) => {
       this.book = items[0];
      })
    },
    updateBook: function(id) {
      fetch(this.url+'/.netlify/functions/bookUpdate/'+id,
        { headers: {'Content-Type':'application/json'},
          method: 'PUT',
          body: JSON.stringify(this.book)})
        .then((data) => {
          this.$router.push('/book');
        }
      )
    },
    createBook: function() {
      fetch(this.url+'/.netlify/functions/bookInsert',
        { headers: {'Content-Type':'application/json'},
          method: 'POST',
          body: JSON.stringify(this.book)})
        .then((data) => {
           this.$router.push('/book');
        }
      )
    }
  }
};
</script>
Aquí es importante explicar cómo se genera el ID para un nuevo registro. Debido a que no resulta sencillo permitir que la base de datos genere un ID y luego nos lo reporte, es mejor generar el ID del lado del frontend. Para generar ese ID simplemente se genera un número aleatorio en un rango muy grande (entre varios millones de números). Mediate este método la probabilidad que se genere un ID que ya exista en la base de datos es muy baja, sin embargo, en el caso extremo que esto suceda simplemente la base de datos generá un error indicando que ya un registro con ese ID existe. Pero es de esperar que este caso no suceda prácticamente nunca.