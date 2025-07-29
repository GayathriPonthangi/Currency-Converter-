class CurrencyConverter {
  constructor() {
    this.apiKey = "YOUR_API_KEY" // You can get a free API key from exchangerate-api.com
    this.baseUrl = "https://api.exchangerate-api.com/v4/latest/"
    this.fallbackRates = {
      USD: {
        EUR: 0.85,
        GBP: 0.73,
        INR: 83.12,
        JPY: 110.0,
        CAD: 1.25,
        AUD: 1.35,
        CHF: 0.92,
        CNY: 6.45,
        SEK: 8.85,
        NZD: 1.42,
        MXN: 17.25,
        SGD: 1.35,
        HKD: 7.85,
        NOK: 8.75,
        KRW: 1320.5,
        TRY: 27.85,
        RUB: 92.5,
        BRL: 5.15,
        ZAR: 18.75,
        PLN: 4.25,
        DKK: 6.35,
        CZK: 22.5,
        HUF: 365.8,
        ILS: 3.65,
        CLP: 890.25,
        PHP: 56.75,
        AED: 3.67,
        SAR: 3.75,
        MYR: 4.68,
        THB: 35.25,
        EGP: 30.85,
        PKR: 285.5,
        BDT: 110.25,
        LKR: 325.75,
        NPR: 133.15,
      },
      EUR: {
        USD: 1.18,
        GBP: 0.86,
        INR: 97.85,
        JPY: 129.53,
        CAD: 1.47,
        AUD: 1.59,
        CHF: 1.08,
        CNY: 7.59,
        SEK: 10.42,
        NZD: 1.67,
        MXN: 20.29,
        SGD: 1.59,
        HKD: 9.24,
        NOK: 10.29,
        KRW: 1557.79,
        TRY: 32.86,
        RUB: 109.15,
        BRL: 6.08,
        ZAR: 22.13,
        PLN: 5.01,
        DKK: 7.49,
        CZK: 26.55,
        HUF: 431.64,
        ILS: 4.31,
        CLP: 1050.5,
        PHP: 66.97,
        AED: 4.33,
        SAR: 4.43,
        MYR: 5.52,
        THB: 41.6,
        EGP: 36.4,
        PKR: 337.09,
        BDT: 130.1,
        LKR: 384.39,
        NPR: 157.12,
      },
      GBP: {
        USD: 1.37,
        EUR: 1.16,
        INR: 113.85,
        JPY: 150.7,
        CAD: 1.71,
        AUD: 1.85,
        CHF: 1.26,
        CNY: 8.84,
        SEK: 12.13,
        NZD: 1.95,
        MXN: 23.63,
        SGD: 1.85,
        HKD: 10.76,
        NOK: 11.99,
        KRW: 1813.89,
        TRY: 38.25,
        RUB: 126.93,
        BRL: 7.07,
        ZAR: 25.73,
        PLN: 5.83,
        DKK: 8.72,
        CZK: 30.83,
        HUF: 501.95,
        ILS: 5.01,
        CLP: 1221.64,
        PHP: 77.84,
        AED: 5.03,
        SAR: 5.14,
        MYR: 6.42,
        THB: 48.29,
        EGP: 42.26,
        PKR: 391.94,
        BDT: 151.24,
        LKR: 446.55,
        NPR: 182.63,
      },
      INR: {
        USD: 0.012,
        EUR: 0.01,
        GBP: 0.0088,
        JPY: 1.32,
        CAD: 0.015,
        AUD: 0.016,
        CHF: 0.011,
        CNY: 0.078,
        SEK: 0.11,
        NZD: 0.017,
        MXN: 0.21,
        SGD: 0.016,
        HKD: 0.095,
        NOK: 0.11,
        KRW: 15.89,
        TRY: 0.335,
        RUB: 1.11,
        BRL: 0.062,
        ZAR: 0.226,
        PLN: 0.051,
        DKK: 0.076,
        CZK: 0.271,
        HUF: 4.4,
        ILS: 0.044,
        CLP: 10.71,
        PHP: 0.683,
        AED: 0.044,
        SAR: 0.045,
        MYR: 0.056,
        THB: 0.424,
        EGP: 0.371,
        PKR: 3.44,
        BDT: 1.33,
        LKR: 3.92,
        NPR: 1.6,
      },
    }

    this.initializeElements()
    this.attachEventListeners()
  }

  initializeElements() {
    this.amountInput = document.getElementById("amount")
    this.fromCurrency = document.getElementById("fromCurrency")
    this.toCurrency = document.getElementById("toCurrency")
    this.convertBtn = document.getElementById("convertBtn")
    this.swapBtn = document.getElementById("swapBtn")
    this.resultSection = document.getElementById("resultSection")
    this.resultAmount = document.getElementById("resultAmount")
    this.exchangeRate = document.getElementById("exchangeRate")
    this.errorMessage = document.getElementById("errorMessage")
    this.errorText = document.getElementById("errorText")
    this.loadingSpinner = document.getElementById("loadingSpinner")
  }

  attachEventListeners() {
    this.convertBtn.addEventListener("click", () => this.convertCurrency())
    this.swapBtn.addEventListener("click", () => this.swapCurrencies())

    // Enter key support
    this.amountInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.convertCurrency()
      }
    })
  }

  async convertCurrency() {
    const amount = Number.parseFloat(this.amountInput.value)
    const from = this.fromCurrency.value
    const to = this.toCurrency.value

    if (!amount || amount <= 0) {
      this.showError("Please enter a valid amount")
      return
    }

    if (from === to) {
      this.displayResult(amount, amount, from, to, 1)
      return
    }

    this.showLoading(true)
    this.hideError()

    try {
      const rate = await this.getExchangeRate(from, to)
      const convertedAmount = amount * rate
      this.displayResult(amount, convertedAmount, from, to, rate)
    } catch (error) {
      console.error("Conversion error:", error)
      this.showError("Unable to fetch exchange rates. Please try again.")
    } finally {
      this.showLoading(false)
    }
  }

  async getExchangeRate(from, to) {
    try {
      // Try to fetch from API
      const response = await fetch(`${this.baseUrl}${from}`)

      if (!response.ok) {
        throw new Error("API request failed")
      }

      const data = await response.json()

      if (data.rates && data.rates[to]) {
        return data.rates[to]
      } else {
        throw new Error("Currency not found in API response")
      }
    } catch (error) {
      console.warn("API failed, using fallback rates:", error)
      // Use fallback rates
      return this.getFallbackRate(from, to)
    }
  }

  getFallbackRate(from, to) {
    if (this.fallbackRates[from] && this.fallbackRates[from][to]) {
      return this.fallbackRates[from][to]
    } else if (this.fallbackRates[to] && this.fallbackRates[to][from]) {
      return 1 / this.fallbackRates[to][from]
    } else {
      // If no direct rate available, calculate through USD
      if (from !== "USD" && to !== "USD") {
        const fromToUsd = this.fallbackRates[from]
          ? this.fallbackRates[from]["USD"]
          : 1 / this.fallbackRates["USD"][from]
        const usdToTo = this.fallbackRates["USD"][to] || 1 / this.fallbackRates[to]["USD"]
        return fromToUsd * usdToTo
      }
      throw new Error("Exchange rate not available")
    }
  }

  displayResult(originalAmount, convertedAmount, fromCurrency, toCurrency, rate) {
    this.resultAmount.textContent = `${convertedAmount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} ${toCurrency}`

    this.exchangeRate.textContent = `1 ${fromCurrency} = ${rate.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    })} ${toCurrency}`

    this.resultSection.classList.add("show")
  }

  swapCurrencies() {
    const fromValue = this.fromCurrency.value
    const toValue = this.toCurrency.value

    this.fromCurrency.value = toValue
    this.toCurrency.value = fromValue

    // Add visual feedback
    this.swapBtn.style.transform = "rotate(180deg)"
    setTimeout(() => {
      this.swapBtn.style.transform = ""
    }, 300)

    // Convert with new currencies
    if (this.amountInput.value && this.amountInput.value > 0) {
      this.convertCurrency()
    }
  }

  showLoading(show) {
    if (show) {
      this.convertBtn.classList.add("loading")
    } else {
      this.convertBtn.classList.remove("loading")
    }
  }

  showError(message) {
    this.errorText.textContent = message
    this.errorMessage.classList.add("show")
    this.resultSection.classList.remove("show")

    // Auto-hide error after 5 seconds
    setTimeout(() => {
      this.hideError()
    }, 5000)
  }

  hideError() {
    this.errorMessage.classList.remove("show")
  }

  // Utility method to format currency
  formatCurrency(amount, currency) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }
}

// Convert between 35+ major world currencies

// Initialize the currency converter when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new CurrencyConverter()
})

// Add some additional utility functions
function addToFavorites(fromCurrency, toCurrency) {
  const favorites = JSON.parse(localStorage.getItem("currencyFavorites") || "[]")
  const pair = `${fromCurrency}-${toCurrency}`

  if (!favorites.includes(pair)) {
    favorites.push(pair)
    localStorage.setItem("currencyFavorites", JSON.stringify(favorites))
  }
}

function getFavorites() {
  return JSON.parse(localStorage.getItem("currencyFavorites") || "[]")
}

// Service Worker registration for offline functionality (optional)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration)
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError)
      })
  })
}
