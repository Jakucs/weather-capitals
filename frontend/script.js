// Add your Javascript code here
let URL = "https://jvvkjy8utk.execute-api.eu-central-1.amazonaws.com/tourist/api/countries/all"
let ul = document.getElementById("ul")

async function fetchData(url){
    let res = await fetch(url)
    let data = await res.json()
    return data
}

async function displayCountries(){
    let datas = await fetchData(URL)
    console.log(datas)
    let sortedDatas = datas.sort((a, b)=> a.name.common.localeCompare(b.name.common))
    for(let country of sortedDatas){
        let li = document.createElement("li")
        li.textContent = `${country.name.common} (${country.capitals[0]})`
        ul.appendChild(li)
    }
}

displayCountries()