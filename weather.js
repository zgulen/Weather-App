const form = document.querySelector("section.top-banner form");
const input = document.querySelector(".top-banner input");
const msg = document.querySelector("span.msg");
const list = document.querySelector(".ajax-section .cities")
form.addEventListener("submit", (e) => {
    e.preventDefault()
    getWeatherDataFromApi();
})
const getWeatherDataFromApi = async () => {
    let token = DecryptStringAES(localStorage.getItem("apiKey"))
    let inputVal = input.value;
    let unitType = "metric"
    let lang = "tr"
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${token}&units=${unitType}&lang=${lang}`
    try {
        // const res = await fetch(url).then(res => res.json())
        const res = await axios(url)
        const { name, main, sys, weather } = res.data
        // console.log(res)
        let iconUrl = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`
        const cityListItem = list.querySelectorAll(".city")
        const cityListItemArray = Array.from(cityListItem);
        if (cityListItemArray.length > 0){
            const filteredArray = cityListItemArray.filter(cityCard => cityCard.querySelector("span").innerText == name)
            if (filteredArray.length > 0) {
                msg.innerText = `You already know the weather for ${name}, please search another city`
                setTimeout(() => {
                    msg.innerText = ""
                }, 5000)
                return
            }
        }
            console.log(cityListItem)
            const createdLi = document.createElement("li")
        createdLi.classList.add("city")
        const createdLiInnerHtml = `
        <h2 class="city-name" data-name="${name},${sys.country}">
        <span>${name}</span>
            <sup>${sys.country}</sup>
            </h2>
            <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
        <figure>
            <img class="city-icon" src="${iconUrl}">
            <figcaption>${weather[0].description}</figcaption>
            </figure>
            `
            createdLi.innerHTML = createdLiInnerHtml
            list.prepend(createdLi)
    } catch (error) {
        msg.innerText = error
        setTimeout(() => {
            msg.innerText = ""
        }, 5000)
    }
    form.reset()
}
