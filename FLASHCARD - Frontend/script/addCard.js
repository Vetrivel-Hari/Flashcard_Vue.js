let app = new Vue({
    el: "#app",
    data: {
        question: "",
        answer: "",
        warng: ""
    },
    methods: {
        addCard(){
            if((this.username != "") && (this.password != "")){
                console.log(this.question);
                console.log(this.answer);

                selectedDeck = localStorage.getItem("selectedDeck");

                var myHeaders = new Headers();
                myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
                myHeaders.append("Content-Type", "application/json");

                var raw = JSON.stringify({
                    "dID": selectedDeck,
                    "question": this.question,
                    "answer": this.answer
                });

                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };

                fetch("http://127.0.0.1:5000/api/card", requestOptions)
                .then(response => response.json())
                .then(result => this.warng = result["message"])
                .catch(error => console.log('error', error));
            }
        }
    }
})