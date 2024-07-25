async function changeInfo(item) {
    await fetch("../real.json", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(item)
    }) 
}