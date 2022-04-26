let app = new Vue({
    el: "#app",
    data: {
      username: "",
      name: "",
      password: "",
      rPassword: "",
      email: "",
      wrng: ""
    },
    methods: {
        validateValues()
        {
          if((this.username != "") && (this.name != "") && (this.password != "") && (this.email != ""))
          {
            if(this.password == this.rPassword)
            {
              var myHeaders = new Headers();
              myHeaders.append("Content-Type", "application/json");

              var raw = JSON.stringify({
                "username": this.username,
                "name": this.name,
                "password": this.password,
                "email": this.email
              });

              var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
              };

              fetch("http://127.0.0.1:5000/api/signup", requestOptions)
                .then(response => {
                  return response.json()
                    }
                  )
                .then(result => {
                  console.log(result);
                  this.wrng = result["message"]
                  localStorage.setItem("token", result["access_token"]);

                  if(this.wrng == "Success")
                    window.location.href = "index.html"
                })
                .catch(error => console.log('error', error));
            }
          else
            this.wrng = "Passwords Should Match"
          }
        }
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