let Bsat; //= 0.32; // teslas
let length_equiv;// = 0.0786; // meters
let permeability_equiv;// = 98; 

let required_inductance;// = 10 / 1000000; // henries

const mu_0 = 4 * Math.PI / 10000000;

// IF GIVEN AL:

let core_factor;// = 0.9 / 1000000; // henries

// ELSE:

let cross_sectional_area;// = 0.000097; // meters^2



// inductance = N * flux / current

// amperes law: B * Length = mu * current_enclosed, B = mu * current_enclosed / Length

// current_enclosed = current * N

// flux = area * B = area * mu_equiv * current * N / length

// mu_equiv = mu_0 * mu_r

// inductance = N * (area * mu_0 * mu_r * current * N / length) / current

// inductance = N^2 * area * mu_0 * mu_r / length


// now for getting saturation current:

// B * length = n * current * mu_0 * mu_r 
// I = B * length / (n * mu_0 * mu_r)

function updateOutputs() {
    if (document.getElementById('dontKnowAL').checked) {
        core_factor = cross_sectional_area * mu_0 * permeability_equiv / length_equiv;
        document.getElementById('alInput').value = core_factor * 1e9;
    }


    let nturns = Math.sqrt(required_inductance / core_factor);
    document.getElementById("nturns").innerHTML = nturns;
    document.getElementById("isat").innerHTML = Bsat * length_equiv / (nturns * mu_0 * permeability_equiv);
}

function lrInputPressed() {
    required_inductance = document.getElementById('lrInput').value / 1e6;
    updateOutputs();
}

function alInputPressed() {
    core_factor = document.getElementById('alInput').value / 1e9;
    updateOutputs();
}

function bsInputPressed() {
    Bsat = document.getElementById('bsInput').value;
    updateOutputs();
}

function leInputPressed() {
    length_equiv = document.getElementById('leInput').value / 1e3;
    updateOutputs();
}

function urInputPressed() {
    permeability_equiv = document.getElementById('urInput').value;
    updateOutputs();
}

function dontKnowALInputPressed() {
    let hidden_things = document.getElementsByClassName("dontknowAL");
    if (document.getElementById('dontKnowAL').checked) {
        for (let i = 0; i < hidden_things.length; i++) {
            hidden_things[i].style.display = "";
        }
        document.getElementById('alInput').disabled = true;


        document.getElementById('urInput').disabled = true;
        document.getElementById('leInput').disabled = true;
    }
    else {
        for (let i = 0; i < hidden_things.length; i++) {
            hidden_things[i].style.display = "none";
        }
        document.getElementById('alInput').disabled = false;


        document.getElementById('urInput').disabled = false;
        document.getElementById('leInput').disabled = false;
    }
}


function areaInputPressed() {
    cross_sectional_area = document.getElementById('areaInput').value / (1000 * 1000);
    updateOutputs();
}


function urInput2Pressed() {
    permeability_equiv = document.getElementById('urInput2').value;
    document.getElementById('urInput').value = parseFloat(permeability_equiv);
    updateOutputs();
}

function leInput2Pressed() {
    length_equiv = document.getElementById('leInput2').value / 1000;
    document.getElementById('leInput').value = 1000 * length_equiv;
    updateOutputs();
}






