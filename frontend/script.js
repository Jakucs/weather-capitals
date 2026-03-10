// Add your Javascript code here
let URL = "https://jvvkjy8utk.execute-api.eu-central-1.amazonaws.com/tourist/api/countries/all"
let api_key = "9f470b0b7f1440689e693427260903"
let root = document.getElementById("root")
let ul = document.getElementById("ul")

// let prev = document.getElementById("prev")
// let next = document.getElementById("next")

async function fetchData(){
    let res = await fetch(URL)
    let data = await res.json()
    return data
}

async function displayCountries(){
    let datas = await fetchData()
    console.log(datas)
    let index = 0;
    let sortedDatas = datas.sort((a, b)=> a.name.common.localeCompare(b.name.common))
    for(let country of sortedDatas){
        let li = document.createElement("li")
        li.textContent = `${country.name.common} (${country.capitals[0]})`
        li.id = index++
        li.classList.add("mainLI")
        ul.appendChild(li)
    }
}

async function fetchOne(city, api_key){
    let finalURL = `http://api.weatherapi.com/v1/current.json?key=${api_key}&q=${city}`
    let res = await fetch(finalURL)
    let data = await res.json()
    return data
}

async function eventListeners(){
    root.addEventListener("click", function(e){
        //console.log("e.target", e.target)
        if(e.target.classList.contains("mainLI")){
            fetchOne(e.target.textContent, api_key).then(data=>displayWeather(e.target, data))
        }

        if(e.target.classList.contains("btn")){
            fetchOne(e.target.textContent, api_key).then(data=>displayWeather(e.target, data))
        }
    })
}


function displayWeather(target, data){
        console.log("target", target)
        let enabledDiv = target.querySelector(".temp-enabled") //TARGET .querySelector
        if(enabledDiv){
            return
        }
        if(document.querySelector(".temp-enabled")){
            document.querySelector(".temp-enabled").remove()
        }

        let div = document.createElement("div")
        div.classList.add("temp-enabled")
        let span = document.createElement("span")
        span.textContent = `Temperature: ${data.current.temp_c}C°`
        span.enabled = true
        div.appendChild(span)

        
        target.appendChild(div)

        let nextElement = target.nextElementSibling
        console.log(nextElement)   
}

displayCountries()
eventListeners()