// Add your Javascript code here
let URL = "https://jvvkjy8utk.execute-api.eu-central-1.amazonaws.com/tourist/api/countries/all"
let api_key = "9f470b0b7f1440689e693427260903"
let root = document.getElementById("root")
let ul = document.getElementById("ul")

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
        ul.appendChild(li)
    }
}

async function fetchOne(city, api_key){
    let finalURL = `http://api.weatherapi.com/v1/current.json?key=${api_key}&q=${city}`
    let res = await fetch(finalURL)
    let data = await res.json()
    return data
}

async function listElementEventListener(){
    root.addEventListener("click", function(e){
        //console.log("e.target", e.target)
        fetchOne(e.target.textContent, api_key).then(data=>displayWeather(e.target, data))
    })
}

function displayWeather(target, data){
    //console.log(data)
    //console.log(id)
    //console.log(clickedElement)
    let li = document.createElement("li")
    li.textContent = `Temperature: ${data.current.temp_c}`
    target.insertAdjacentElement("afterend", li)
    //ul.appendChild(li)
}

displayCountries()
listElementEventListener()