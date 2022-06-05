let baseCurrency = 'AUD'
let targetCurrency = 'GBP'
let convertCurrencyAPI

const inputBaseCurrency = document.querySelector('input#baseCurrency')
const selectBaseCurrency = document.querySelector('select#selectBaseCurrency')
const inputTargetCurrency = document.querySelector('input#targetCurrency')
const selectTargetCurrency = document.querySelector('select#selectTargetCurrency')
const conversionText = document.querySelector('div#conversionText')
const conversionDate = document.querySelector('div#conversionDate')
const button = document.querySelector('button')

// Functions

function getResults() {

    convertCurrencyAPI = `https://api.exchangerate.host/convert?from=${baseCurrency}&to=${targetCurrency}`
    toggleLoading(true)
    fetch(convertCurrencyAPI).then(currency => currency.json()).then(displayResults).catch(error => {
        toggleLoading(false)
        return error
    })
}

function getCurrencyInfo() {

    const currencySymbolsAPI = `https://api.exchangerate.host/symbols`

    fetch(currencySymbolsAPI).then(currencies => currencies.json()).then(populateDropDown).catch(error => {
        return error
    })
}

function displayResults(currency) {


    // Runs the conversion functions when changing the input
    inputBaseCurrency.addEventListener('input', baseConversion)
    inputTargetCurrency.addEventListener('input', targetConversion)

    // Selects the base rate
    let baseRate = currency.result

    // The two different exchange rates, to 6 decimnal points then converts to number
    let currencyFrom = parseFloat(baseRate.toFixed(6))
    let currencyTo = parseFloat((1 / baseRate).toFixed(6))

    // Stores currency exchange rates and input data
    const currencyData = {
        baseRate: currencyTo,
        targetRate: currencyFrom,
        baseInput: 0,
        targetInput: 0,
    }

    // Function to convert input number with the target currency
    function multiplyRate(input, target) {
        return input * target
    }

    // Changes the input values based on exchange rate
    function baseConversion() {

        // Sets object data to the input
        currencyData.baseInput = parseFloat(inputBaseCurrency.value)

        // Takes the return value from the multiplay rate function
        const baseToTarget = parseFloat(multiplyRate(currencyData.baseInput, currencyData.targetRate).toFixed(2))
            // Updates the target input
        inputTargetCurrency.value = baseToTarget

    }

    function targetConversion() {

        currencyData.targetInput = parseFloat(inputTargetCurrency.value)

        const targetToBase = parseFloat(multiplyRate(currencyData.targetInput, currencyData.baseRate)).toFixed(2)
        inputBaseCurrency.value = targetToBase
    }

    // Updates the currency text
    const newDate = new Date(currency.date)
    const newDateString = newDate.toString().slice(3, 15)
    conversionText.innerHTML = `1 ${baseCurrency} = ${currencyFrom} ${targetCurrency}`
    conversionDate.innerHTML = `Data accurate as of ${newDateString}`

    // Runs the initial base conversion
    baseConversion()
    setTimeout(function() {
        toggleLoading(false)
    }, 500)
}

function populateDropDown(currencies) {

    // Assign data from API to an array
    const symbolsObject = currencies.symbols
    const symbolsArray = []

    for (const key in symbolsObject) {
        symbolsArray.push(symbolsObject[key].code)
    }

    // console.log(symbolsCode)

    symbolsArray.forEach(data => {
        // Update Base
        const optionElBase = document.createElement('option')
        selectBaseCurrency.append(optionElBase)
        optionElBase.className = 'baseCurrency'
        optionElBase.value = data
        optionElBase.innerHTML = data

        // Update Target
        const optionElTarget = document.createElement('option')
        selectTargetCurrency.append(optionElTarget)
        optionElTarget.className = 'targetCurrency'
        optionElTarget.value = data
        optionElTarget.innerHTML = data
    })
    const optionBase = document.querySelectorAll('option.baseCurrency')
    const optionTarget = document.querySelectorAll('option.targetCurrency')

    // Apply 'selected' to the default base currency
    optionBase.forEach(e => {
        if (e.innerHTML === baseCurrency) {
            e.setAttribute('selected', 'selected')
        }
    })

    // Apply 'selected' to the default target currency
    optionTarget.forEach(e => {
        if (e.innerHTML === targetCurrency) {
            e.setAttribute('selected', 'selected')
        }
    })

    updateCurrencyList()
}

function switchCurrencies() {

    const button = document.querySelector('button')

    button.addEventListener('click', function(e) {
        selectBaseCurrency.value = targetCurrency
        selectTargetCurrency.value = baseCurrency
        baseCurrency = selectBaseCurrency.value
        targetCurrency = selectTargetCurrency.value
        getResults()
    })
}

function updateCurrencyList() {
    // Change the default base currency when updating the dropdown input
    selectBaseCurrency.addEventListener('change', function() {
        const selectedBaseCurrency = selectBaseCurrency.options[selectBaseCurrency.selectedIndex].text
        baseCurrency = selectedBaseCurrency
            // Run the conversion function
        getResults()
    })

    // Change the default target currency when updating the dropdown input
    selectTargetCurrency.addEventListener('change', function() {
        const selectedTargetCurrency = selectTargetCurrency.options[selectTargetCurrency.selectedIndex].text
        targetCurrency = selectedTargetCurrency
            // Run the conversion function
        getResults()
    })
}

function toggleLoading(state) {
    const loadingIcon = document.querySelector('#loading')
        // In here we toggle the page loading state between loading and not-loading
        // if our state is true, we add a loading class to body
    if (state) {
        loadingIcon.style.display = 'block';
    } else {
        loadingIcon.style.display = 'none';
    }
}

// Animation
button.addEventListener('click', function(e) {
    e.target.classList.add('animationActive')
    setTimeout(function() {
        e.target.classList.remove('animationActive')
    }, 500)
})

// Start program

// Dom Content Loaded
getResults()
getCurrencyInfo()
switchCurrencies()