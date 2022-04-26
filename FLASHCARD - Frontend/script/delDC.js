let app = new Vue({
    el: "#app",
    methods: {
        delDeck(){
            window.location.href = "delDeck.html";
        },
        delCard()
        {
            window.location.href = "delCardDeckSelect.html";
        }
    }
})