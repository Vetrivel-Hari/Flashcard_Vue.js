let app = new Vue({
    el: "#app",
    data: {
        username: "",
        password: "",
        passMsg: ""
    },
    methods: {
        validatePassword(){
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
                window.location.href = "editProfile.html"
              })
              .catch(error => {
                this.passMsg = "Username (or) Password Incorrect";
              });
          }

        }
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
        .then(result => {
            this.username = result["username"]
           })
        .catch(error => console.log('error', error));
    }
})

function showPass() {
    var x = document.getElementById("pass");
    if (x.type === "password") {
      x.type = "text";
      document.getElementById("sPass").style.cssText = 'background-color: #fff; color: #000;';
      document.getElementById('sPass').textContent = 'HIDE PASSWORD';
    } else {
      x.type = "password";
      document.getElementById("sPass").style.cssText = 'background-color: #000; color: #fff;';
      document.getElementById('sPass').textContent = 'SHOW PASSWORD';
    }
  }