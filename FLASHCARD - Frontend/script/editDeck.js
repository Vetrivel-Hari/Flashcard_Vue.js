let app = new Vue({
    el: "#app",
    data: {
        deckName: "",
        warng: ""
    },
    methods: {
        editDeckName(){
          if(this.deckName != "")
          {
                selectedDeck = localStorage.getItem("selectedDeck");
                console.log(this.deckName);

                var myHeaders = new Headers();
                myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
                myHeaders.append("Content-Type", "application/json");

                var raw = JSON.stringify({
                    "dID": selectedDeck,
                    "newDeckName": this.deckName
                });

                var requestOptions = {
                    method: 'PUT',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                    };

                    fetch("http://127.0.0.1:5000/api/deck", requestOptions)
                    .then(response => response.json())
                    .then(result => this.warng = result["message"])
                    .catch(error => console.log('error', error));
                }

        }
    }
})