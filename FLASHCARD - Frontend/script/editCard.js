let app = new Vue({
    el: "#app",
    data: {
        defaultQuestion: "",
        defaultAnswer: "",
        warng: ""
    },
    methods: {
        editCard(){
          if((this.defaultQuestion != "") && (this.defaultAnswer != ""))
          {
                selectedCard = localStorage.getItem("selectedCard");

                var myHeaders = new Headers();
                myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
                myHeaders.append("Content-Type", "application/json");

                var raw = JSON.stringify({
                    "qID": selectedCard,
                    "question": this.defaultQuestion,
                    "answer": this.defaultAnswer
                });

                var requestOptions = {
                    method: 'PUT',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };

                fetch("http://127.0.0.1:5000/api/card", requestOptions)
                .then(response => response.json())
                .then(result => {
                    this.warng = result["message"]
                     localStorage.setItem("question", this.defaultQuestion);
                     localStorage.getItem("answer", this.defaultAnswer);
                })
                .catch(error => console.log('error', error));
                }
        }
    },
    mounted(){
        this.defaultQuestion = localStorage.getItem("question");
        this.defaultAnswer = localStorage.getItem("answer");
    }
})