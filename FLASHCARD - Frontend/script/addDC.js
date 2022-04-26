let app = new Vue({
    el: "#app",
    methods: {
        addDeck(){
            window.location.href = "addDeck.html";
        },
        addCard()
        {
            window.location.href = "cardAddSelect.html";
        }
    }
})