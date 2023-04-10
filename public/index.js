fetch('https://myanimelist.net/anime/season/2023/spring')
.then(response=>response.json())
.then(data=>{
    let cardNode= document.querySelectorAll('js-anime-category-producer seasonal-anime js-seasonal-anime js-anime-type-all js-anime-type-1')
    console.log(cardNode);
})