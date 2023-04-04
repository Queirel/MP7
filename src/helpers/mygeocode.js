// De la direccion a place_id
const address = "caba"
// const res = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.MAPS_API_KEY}`)
const res = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`,{
    params:{
        address: address,
        key:process.env.MAPS_API_KEY }
})

console.log(res.data.results[0])

// De place_id a los datos
`https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=${process.env.MAPS_API_KEY}`