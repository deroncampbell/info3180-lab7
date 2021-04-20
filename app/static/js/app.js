/* Add your Application JavaScript */
// Instantiate our main Vue Instance
const app = Vue.createApp({
    data() {
        return {

        }
    }
});

const UploadForm = {
    name: 'upload-form',
    template: `
    <h1 id ="form-heading">Upload Form</h1>
    <div class="errorclass">
        <ul class="uploadmessage" v-for="message in messages">
            <li >{{message}}</li>
        </ul>
    </div>
    <form method="POST" id="UploadForm" @submit.prevent="uploadPhoto">

        <div class="form-group">
            <label class="form-label" for="description">Description about Image</label>
            <textarea type="text" name="description" class="form-control"></textarea>
            <label for="photo">Photo Upload</label>
            <input type="file" name="photo" id="photo" class="form-control" accept="image/x-png,image/jpg">
        </div>
        <button type="submit" name="submit" class="btn btn-success">Submit</button>
    </form>
    `,
    data: function() {
        return {
            messages: [],
            errors: [],
            className : ''
        }
    },
    methods: {
        uploadPhoto: function() {
            let self = this;
            let UploadForm = document.getElementById('UploadForm');
            let form_data = new FormData(UploadForm);

            fetch("/api/upload", {
                method: 'POST',
                body: form_data,
                headers: {
                    'X-CSRFToken': token
                },
                credentials: 'same-origin'        
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(jsonResponse) {
                console.log('data');
                console.log(jsonResponse);

                if (jsonResponse['data']) {
                    self.className = "data"
                    self.messages = [jsonResponse[
                        'data']
                        ['message']];
                } else {
                    self.messages = jsonResponse
                    ['errors']
                    ['errors'];
                    self.className = "errors"
                }

            })
            .catch(function(error) {
                console.log(error);
            });
    
        }
    }
};

app.component('app-header', {
    name: 'AppHeader',
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <a class="navbar-brand" href="#">Lab 7</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <router-link class="nav-link" to="/">Home <span class="sr-only">(current)</span></router-link>
          </li>
          <li class="nav-item active">
            <router-link class="nav-link" to="/upload">Upload</router-link>
          </li>
        </ul>
      </div>
    </nav>
    `
});

app.component('app-footer', {
    name: 'AppFooter',
    template: `
    <footer>
        <div class="container">
            <p>Copyright &copy; {{ year }} Flask Inc.</p>
        </div>
    </footer>
    `,
    data() {
        return {
            year: (new Date).getFullYear()
        }
    }
});

const Home = {
    name: 'Home',
    template: `
    <div class="jumbotron">
        <h1>Lab 7</h1>
        <p class="lead">In this lab we will demonstrate VueJS working with Forms and Form Validation from Flask-WTF.</p>
    </div>
    `,
    data() {
        return {}
    }
};

const NotFound = {
    name: 'NotFound',
    template: `
    <div>
        <h1>404 - Not Found</h1>
    </div>
    `,
    data() {
        return {}
    }
};

// Define Routes
const routes = [
    { path: "/", component: Home },
    // Put other routes here
    {path:"/upload", component: UploadForm},

    // This is a catch all route in case none of the above matches
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound }
];

const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes, // short for `routes: routes`
});

app.use(router);

app.mount('#app');