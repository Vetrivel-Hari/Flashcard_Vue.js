let app = new Vue({
    el: "#app",
    data: {
        username: "",
        password: "",
        wrng: ""
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

        }
    }
})

function checkValidUsername(s)
{
  const special_characters = "\!@#$%^&*()-+?_=,<>/'";

    if (s.length >= 5)
    {
        for (let i=0; i<s.length; i++)
        {
            if (special_characters.includes(s[i]))
                return False;
        }
    }
    else
        return False;

    return True;
}

function checkValidUsername(s)
{

}

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