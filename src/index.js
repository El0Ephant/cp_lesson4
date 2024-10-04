import { MiniMaple } from "./miniMaple";

document.addEventListener('DOMContentLoaded',setup)

function setup() {
    const button = document.getElementById('button');
    button.onclick = deriviate;
}

function deriviate(){
    const input = document.getElementById('input').value;
    const varName = document.getElementById('varName').value;

    const output = document.getElementById('output');
    const rawOutput = document.getElementById('rawOutput');
    const errorOutput = document.getElementById('errorOutput');
    output.innerHTML = "";
    rawOutput.innerHTML = "";
    errorOutput.innerHTML = "";
    
    try {
        output.innerHTML = MiniMaple.deriviative(input, varName);
        rawOutput.innerHTML= `Before simplification: ${MiniMaple.deriviative(input, varName, true)}`;
    }
    catch (error) {
        errorOutput.innerHTML = error.message;
    }
}