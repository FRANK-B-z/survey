const buySellSelect = document.getElementById("buySellSelect");
const sellingSection = document.getElementById("sellingSection");
const buyingSection = document.getElementById("buyingSection");

buySellSelect.addEventListener("change", function() {

    if (this.value === "both") {
        sellingSection.style.display = "block";
        buyingSection.style.display = "block";
    }

    else if (this.value === "buy") {
        sellingSection.style.display = "none";
        buyingSection.style.display = "block";
    }

    else {
        sellingSection.style.display = "none";
        buyingSection.style.display = "none";
    }

});

