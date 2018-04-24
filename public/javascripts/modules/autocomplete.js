function autocomplete(input, lngInput, latInput) {

    if(!input) return;

    const dropdown = new google.maps.places.Autocomplete(input);

    dropdown.addListener('place_changed', () => {
        const place = dropdown.getPlace();
        lngInput.value = place.geometry.location.lng();
        latInput.value = place.geometry.location.lat();
    });

    input.on('keydown', (e)=>{
        if(e.keyCode === 13) e.preventDefault();
    })
}

export default autocomplete;
