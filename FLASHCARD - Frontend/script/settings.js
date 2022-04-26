let app = new Vue({
    el: "#app",
    methods: {
        viewProfile(){
            window.location.href = "profile.html";
        },
        cUsername()
        {
            window.location.href = "getPass.html";
        },
        
        delAcc()
        {
            window.location.href = "delAcc.html";
        }
    }
})