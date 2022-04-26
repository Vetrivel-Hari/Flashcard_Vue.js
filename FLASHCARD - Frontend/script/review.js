let app = new Vue({
    el: "#app",
    data: {
        cards: [],
        b: 0,
        cPosition: 0,
        cText: "",
        qnRAns: "Question",
        qStat: {},
        txt: ""
    },
    methods: {
        toHome(){
            window.location.href = "dashboard.html";
        },
        previous(){
            if((this.cPosition - 1) >= 0){
                this.cPosition = this.cPosition - 1;
                this.cText = Object.values(Object.values(this.cards)[this.cPosition])[0]["question"]
            }
        },
        reveal(){
            if(this.b == 0)
            {
                this.b = 1;
                this.qnRAns = "Answer";
                this.cText = Object.values(Object.values(this.cards)[this.cPosition])[0]["answer"]
            }
        },
        next(){
            if((this.cPosition + 1) < this.cards.length){
                this.cPosition = this.cPosition + 1;
                this.cText = Object.values(Object.values(this.cards)[this.cPosition])[0]["question"]
            }
        },
        easy(){
            qID = Object.keys(Object.values(this.cards)[this.cPosition])[0];

            this.qStat = {}
            this.qStat["qID"] = String(qID);
            this.qStat["Easy"] = "1";
            this.qStat["Medium"] = "0";
            this.qStat["Hard"] = "0";
                
            this.sendData();

            this.b = 0;
            this.qnRAns = "Question";
            this.cText = Object.values(Object.values(this.cards)[this.cPosition])[0]["question"];
            this.next();

        },
        medium(){
            qID = Object.keys(Object.values(this.cards)[this.cPosition])[0];

            this.qStat = {}
            this.qStat["qID"] = String(qID);
            this.qStat["Easy"] = "0";
            this.qStat["Medium"] = "1";
            this.qStat["Hard"] = "0";
                
            this.sendData();

            this.b = 0;
            this.qnRAns = "Question";
            this.cText = Object.values(Object.values(this.cards)[this.cPosition])[0]["question"];
            this.next();
        },
        hard(){
            qID = Object.keys(Object.values(this.cards)[this.cPosition])[0];

            this.qStat = {}
            this.qStat["qID"] = String(qID);
            this.qStat["Easy"] = "0";
            this.qStat["Medium"] = "0";
            this.qStat["Hard"] = "1";
                
            this.sendData();

            this.b = 0;
            this.qnRAns = "Question";
            this.cText = Object.values(Object.values(this.cards)[this.cPosition])[0]["question"];
            this.next();
        },
        sendData(){
            console.log("SEND DATA CALLED");

            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
            "message": this.qStat
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("http://127.0.0.1:5000/api/stat", requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
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
            if(result["message"] != "No Cards Available"){
                this.cards = result["message"]
                this.cText = Object.values(Object.values(this.cards)[this.cPosition])[0]["question"]
            }
            else
                this.txt = "No Cards Available"
            this.cards = result["message"];
            
        })
        .catch(error => console.log('error', error));
    },
})