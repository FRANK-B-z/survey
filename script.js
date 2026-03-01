const buySellRadios = document.querySelectorAll("input[name='buy_sell']");

const bothSection = document.getElementById("bothSection");
const buyingSection = document.getElementById("buyingSection");
const sellingSection = document.getElementById("sellingSection");
const noneSection = document.getElementById("noneSection");

buySellRadios.forEach(radio => {
    radio.addEventListener("change", function () {

        // Hide all sections first
        bothSection.style.display = "none";
        buyingSection.style.display = "none";
        sellingSection.style.display = "none";
        noneSection.style.display = "none";

        // Show only selected section
        if (this.value === "both") {
            bothSection.style.display = "block";
        }
        else if (this.value === "buy") {
            buyingSection.style.display = "block";
        }
        else if (this.value === "sell") {
            sellingSection.style.display = "block";
        }
        else if (this.value === "none") {
            noneSection.style.display = "block";
        }
    });
});

const useAppRadios = document.querySelectorAll("input[name='use_app']");

const yesSection = document.getElementById("yesSection");
const businessSection = document.getElementById("businessSection");
const noSection = document.getElementById("noSection");
const maybeSection = document.getElementById("maybeSection");

useAppRadios.forEach(radio => {
    radio.addEventListener("change", function () {

        // Hide all first
        yesSection.style.display = "none";
        businessSection.style.display = "none";
        noSection.style.display = "none";
        maybeSection.style.display = "none";

        // Show based on selection
        if (this.value === "yes") {
            yesSection.style.display = "block";
        }

        if (this.value === "business") {
            businessSection.style.display = "block";
        }

        if (this.value === "no") {
            noSection.style.display = "block";
        }

        if (this.value === "maybe") {
            maybeSection.style.display = "block";
        }

    });
});
