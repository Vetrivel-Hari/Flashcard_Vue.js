let app = new Vue({
    el: "#app",
    data: {
        decks: [],
        txt: ""
    },
    methods: {
        toHome(){
            window.location.href = "dashboard.html";
        },
        deckSelected(){
            localStorage.setItem("selectedDeck", event.srcElement.id);
            window.location.href="delCardCardSelect.html";
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

        fetch("http://127.0.0.1:5000/api/deck", requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result["message"])
            if(result["message"] != "No Decks Available")
                this.decks = result["message"]
            else
                this.txt = "No Decks Available"
            })
        .catch(error => console.log('error', error));
    }
})