let app = new Vue({
    el: "#app",
    data: {
        welcome: ""
    },
    methods: {
        validateCredentials(){
          if((this.username != "") && (this.password != ""))
          {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
              "username": this.username,
              "password": this.password
            });

            var requestOptions = {
              method: 'POST',
              headers: myHeaders,
              body: raw,
              redirect: 'follow'
            };

            fetch("http://127.0.0.1:5000/api/login", requestOptions)
              .then(response => {
                  data = response.json()
                  if(response.status == 400)
                    return data;
              })
              .then(result => {
                console.log(result);
                localStorage.setItem("token", result["access_token"]);
                window.location.href = "dashboard.html"
              })
              .catch(error => {
                this.wrng = "Username (or) Password Incorrect";
              });
          }

        },
        logout(){
            localStorage.setItem("token", "");
            window.location.href="index.html"
        },
        study()
        {
            window.location.href = "studyDeckSelect.html";
        },
        analysis()
        {
            window.location.href = "analysis.html";
        },
        addDC()
        {
            window.location.href = "addDC.html";
        },
        editDC()
        {
            window.location.href = "editDC.html";
        },
        delDC()
        {
            window.location.href = "delDC.html";
        },
        settings()
        {
            window.location.href = "settings.html";
        },

    },
    mounted()
    {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };

        fetch("http://127.0.0.1:5000/api/user", requestOptions)
        .then(response => {
            if(response.status == 401)
                window.location.href="index.html"

            return response.json()
        })
        .then(result => this.welcome = "Hello, " + result["name"] + "!")
        .catch(error => console.log('error', error));
    }
})