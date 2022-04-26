let app = new Vue({
    el: "#app",
    data: {
        cards: [],
        txt: ""
    },
    methods: {
        toHome(){
            window.location.href = "dashboard.html";
        },
        async cardSelected(){
            console.log(event.srcElement.id)
            
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
            "qID": event.srcElement.id
            });

            var requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
            };

            await fetch("http://127.0.0.1:5000/api/card", requestOptions)
            .then(response => response.json())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));

            window.location.href = "dashboard.html";
        }
    },
    mounted()
    {
        selectedDeck = localStorage.getItem("selectedDeck")

        console.log(selectedDeck);

        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
        "dID": selectedDeck
        });

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        fetch("http://127.0.0.1:5000/api/getCard", requestOptions)
        .then(response => response.json())
        .then(result => {
            if(result["message"] != "No Cards Available")
                this.cards = result["message"]
            else
                this.txt = "No Cards Available"
            console.log(this.cards);
        })
        .catch(error => console.log('error', error));
    }
})