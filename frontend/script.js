// Add your Javascript code here
let URL = "https://jvvkjy8utk.execute-api.eu-central-1.amazonaws.com/tourist/api/countries/all"
let api_key = "9f470b0b7f1440689e693427260903"
let root = document.getElementById("root")
let ul = document.getElementById("ul")

let prev = document.getElementById("prev")
let next = document.getElementById("next")

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
        //console.log(country.name.common, country.cca3)
        let li = document.createElement("li")
        li.textContent = `${country.name.common} (${country.capitals[0]})`
        li.id = index++
        li.classList.add("mainLI")
        li.dataset.cca3=country.cca3 //ÚJ
        ul.appendChild(li)
    }
}

async function displayBorderCapitals(borders){
    let countries = await fetchData()
    let capitalNames = [];
    //console.log(countries)
    for(let border of borders){
        //console.log(typeof border)
        for(let country of countries){
            //console.log(typeof country.cca3)
            if(border == country.cca3){
                capitalNames.push(country.capitals[0])
            }
        }
    }
    console.log(capitalNames)
    
        let enabledDiv = document.querySelector(".temp-enabled") //TARGET .querySelector
/*         if(enabledDiv){
            return
        }
        if(document.querySelector(".temp-enabled")){
            document.querySelector(".temp-enabled").remove()
        } */

        for(let capital of capitalNames){
            let div = document.createElement("div")
            div.classList.add("temp-enabled", "city-enabled")
            let span = document.createElement("span")
            span.enabled = true
            span.style.fontWeight = "50"
            span.textContent=capital
            div.appendChild(span)
            enabledDiv.appendChild(div)
        }

    }
    
async function searchCountry(){
    console.log("lefut")
    let city = document.querySelector(".city-enabled")
    console.log("city", city)
    root.addEventListener("click", function(e){
        console.log("e.target", e.target.parentElement)
        if(!e.target.parentElement.classList.contains("city-enabled")) return
        console.log("e.target in SEARCH:", e.target)
        let temp_enabled = document.querySelector(".temp-enabled")
        let p = temp_enabled.querySelector("p")
        if(p){
            p.remove()
        }
       console.log("temp_enabled", temp_enabled)
        let selectedCapital = e.target.textContent
        console.log(selectedCapital)
        fetchOne(selectedCapital, api_key).then(data=>{
            let temperature = data.current.temp_c

            let enabledElement = e.target.querySelectorAll(".city-temp-enabled")
            console.log("enabledElement", enabledElement)
            if(enabledElement){
                
                let p = document.createElement("p")
                p.innerHTML = `<br> ${temperature} C°`
                p.classList.add("city-temp-enabled")
                e.target.insertAdjacentElement("afterend", p)
                console.log("p.parentElement", p.parentElement)

            }
            //div.parentElement.appendChild(div)
        })
        // fetchOne(selectedCapital, api_key).then(data=>displayWeather(e.target, data))
        // fetchBorders(e.target.dataset.cca3).then(data=>displayBorderCapitals(data))
    })
}

searchCountry()





async function fetchOne(city, api_key){
    let finalURL = `http://api.weatherapi.com/v1/current.json?key=${api_key}&q=${city}`
    let res = await fetch(finalURL)
    let data = await res.json()
    return data
}

async function mainLIEventListener(){
    root.addEventListener("click", function(e){
        //console.log("e.target in MAIN:", e.target)
        if(e.target.classList.contains("mainLI")){
            //console.log("e.target.textContent", e.target.textContent)
            fetchOne(e.target.textContent, api_key).then(data=>displayWeather(e.target, data))
            fetchBorders(e.target.dataset.cca3).then(data=>displayBorderCapitals(data))
        }

        // if(e.target.classList.contains("next")){
        //     fetchOne(e.target.textContent, api_key).then(data=>displayWeather(e.target, data))
        // }
    })
}

async function fetchBorders(cca3){
    let url = "https://jvvkjy8utk.execute-api.eu-central-1.amazonaws.com/tourist/api/countries/by-cca3/"
    let finalURL = `${url}${cca3}`
    let res = await fetch(finalURL)
    let data = await res.json()
    let borders = data.borders
    return borders
}


function buttonEventListeners(){
    prev.addEventListener("click" ,function(e){
        let currentLi = document.querySelector(".temp-enabled").parentElement
        let previousID=parseInt(currentLi.id)-1 //előző id
        let previousLI = document.getElementById(previousID) //valódi előző li
        //console.log("previousLI", previousLI)
        //console.log("e.target.textContent", e.target.textContent)
        fetchOne(previousLI.textContent, api_key).then(data=>displayWeather(previousLI, data)) //e.target helyett previousLI -t adjuk át (displayWeather(previousLI, data))
        fetchBorders(previousLI.dataset.cca3).then(data=>displayBorderCapitals(data))
    }) //fetchOne -nál e.target.textContent helyett previousLI.textContent-t adjuk át
    
    next.addEventListener("click" ,function(e){
        let currentLi = document.querySelector(".temp-enabled").parentElement
        let nextID=parseInt(currentLi.id)+1 //kövi id
        let nextLI = document.getElementById(nextID) //valódi kövi li
        console.log("nextID", nextID)
        fetchOne(nextLI.textContent, api_key).then(data=>displayWeather(nextLI, data)) //e.target helyett nextLI -t adjuk át
        fetchBorders(nextLI.dataset.cca3).then(data=>displayBorderCapitals(data))
    }) 
}

function checkButtonDisable(id){
    if(id==0){
        prev.disabled = true
        next.disabled = false
    }   
    else if(id==249){
        prev.disabled = false
        next.disabled = true
    }
    
    else if (id>0) {
        prev.disabled=false
        next.disabled=false
    }
}

function displayWeather(target, data){
        //console.log("target", target)
        let enabledDiv = target.querySelector(".temp-enabled") //TARGET .querySelector
        if(enabledDiv){
            return
        }
        if(document.querySelector(".temp-enabled")){
            document.querySelector(".temp-enabled").remove()
        }
        //console.log("enabledDiv", document.querySelector(".temp-enabled"))
        let id = target.id
        checkButtonDisable(id)

        let div = document.createElement("div")
        div.classList.add("temp-enabled")
        let span = document.createElement("span")
        span.textContent = `Temperature: ${data.current.temp_c}C°`
        span.enabled = true
        div.appendChild(span)
        target.appendChild(div)
}

displayCountries()
mainLIEventListener()
buttonEventListeners()