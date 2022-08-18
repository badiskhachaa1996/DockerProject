function test() {
    console.log("fonction test lancé")
}

console.log("Debut du programme")
setTimeout(function () {
    test()
}, 1000);
console.log("Milieu du programme")
setTimeout(function () {
    test()
}, 2000);
console.log("Fin du programme")