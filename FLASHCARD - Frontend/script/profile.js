let app = new Vue({
    el: "#app",
    data: {
        name: "",
        uName: "",
        email: "",
        nd: ""
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
            this.name = result["name"]
            this.uName = result["username"]
            this.email = result["email"]
            this.nd = result["nod"]
           })
        .catch(error => console.log('error', error));
    }
})