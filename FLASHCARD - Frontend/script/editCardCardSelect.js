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
        cardSelected(){
            console.log(event.srcElement.id)
            localStorage.setItem("selectedCard", event.srcElement.id);
            for(var i in this.cards){
                var val = this.cards[i];
                for(var j in val){
                    var sub_key = j;
                    if(sub_key == event.srcElement.id)
                    {
                        localStorage.setItem("question", val[j]["question"]);
                        localStorage.setItem("answer", val[j]["answer"]);
                    }
                    var sub_val = val[j];
                }
            }

            window.location.href = "editCard.html";
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