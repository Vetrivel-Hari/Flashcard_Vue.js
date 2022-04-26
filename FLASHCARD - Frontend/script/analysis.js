let app = new Vue({
    el: "#app",
    data: {
        qStat: {}
    },
    methods: {
        toHome(){
            window.location.href = "dashboard.html";
        },
    },
    async beforeMount()
    {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        await fetch("http://127.0.0.1:5000/api/stat", requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            this.qStat = result
        })
        .catch(error => console.log('error', error));

        console.log("BYEE");
        const labels = [
            'EASY',
            'MEDIUM',
            'HARD',
            'ATTEMPTS'];
    
        const chartData = {
            labels: labels,
            datasets: [{
            label: 'SCORE',
        
            data: [this.qStat["EASY"], this.qStat["MEDIUM"], this.qStat["HARD"], this.qStat["ATTEMPTED"]],
            backgroundColor : [
              "#42c8f5", "#42c8f5", "#42c8f5", "#42c8f5"
            ],
            }]
        };
    
        const config = {
            type: 'bar',
            data: chartData,
            options: {}
        };
    
        var myChart = new Chart(
            document.getElementById('myChart'),
            config
        );
    }
})