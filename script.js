const buySellRadios = document.querySelectorAll("input[name='buy_sell']");
const sellingSection = document.getElementById("sellingSection");
const buyingSection = document.getElementById("buyingSection");

buySellRadios.forEach(radio => {
    radio.addEventListener("change", function() {
        if (this.value === "both") {
            sellingSection.style.display = "block";
            buyingSection.style.display = "block";
        } else if (this.value === "buy") {
            sellingSection.style.display = "none";
            buyingSection.style.display = "block";
        } else {
            sellingSection.style.display = "none";
            buyingSection.style.display = "none";
        }
    });
});

const useAppRadios = document.querySelectorAll("input[name='use_app']");
const businessSection = document.getElementById("businessSection");

useAppRadios.forEach(radio => {
    radio.addEventListener("change", function() {
        if (this.value === "yes") {
            businessSection.style.display = "block";
        } else {
            businessSection.style.display = "none";
        }
    });
});
