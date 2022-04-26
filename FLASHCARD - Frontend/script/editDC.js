let app = new Vue({
    el: "#app",
    methods: {
        editDeck(){
            window.location.href = "editDeckSelect.html";
        },
        editCard()
        {
            window.location.href = "editCardDeckSelect.html";
        }
    }
})