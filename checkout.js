// This is a public sample test API key.
// Don’t submit any personally identifiable information in requests made with this key.
// Sign in to see your own test API key embedded in code samples.
const urlString = window.location.href;
let paramString = urlString.split("?")[1];
let queryString = new URLSearchParams(paramString);
let clientSecret;
let publishableKey;
let currency;
let elements;
let redirectURL;

for (let pair of queryString.entries()) {
  switch (pair[0]) {
    case "clientSecret":
      clientSecret = pair[1];
      break;
    case "publishableKey":
      publishableKey = pair[1];
      break;
    case "amount":
      document.getElementById("amount").innerHTML = pair[1];
      break;
    case "currency":
      currency = new Intl.NumberFormat("en", {
        style: "currency",
        currency: pair[1],
      }).formatToParts()[0].value;
      document.getElementById("currency").innerHTML = currency;
      break;
    case "firstName":
      document.getElementById("firstName").value = pair[1];
      break;
    case "lastName":
      document.getElementById("lastName").value = pair[1];
      break;
    case "redirectURL":
      redirectURL = pair[1];
      break;
  }
}

const stripe = Stripe(publishableKey);

initialize();

function validateInput(inputElement, validationElement) {
  if (inputElement.value.trim() === "") {
    validationElement.hidden = false;
    inputElement.classList.add("error");
  } else {
    validationElement.hidden = true;
    inputElement.classList.remove("error");
  }
}

const firstNameInput = document.getElementById("firstName");
const firstNameError = document.getElementById("firstNameValidation");
const lastNameInput = document.getElementById("lastName");
const lastNameError = document.getElementById("lastNameValidation");

firstNameInput.addEventListener("input", function () {
  validateInput(firstNameInput, firstNameError);
});

lastNameInput.addEventListener("input", function () {
  validateInput(lastNameInput, lastNameError);
});

document
  .querySelector("#payment-form")
  .addEventListener("submit", handleSubmit);

// Fetches a payment intent and captures the client secret
async function initialize() {
  const appearance = {
    theme: "stripe",
  };
  elements = stripe.elements({ appearance, clientSecret });

  const paymentElementOptions = {
    layout: "tabs",
  };

  const paymentElement = elements.create("payment", paymentElementOptions);
  paymentElement.mount("#payment-element");
}

async function handleSubmit(e) {
  e.preventDefault();
  setLoading(true);
  if (firstNameInput.value === "") {
    setLoading(false);
    return false;
  }
  if (lastNameInput.value === "") {
    setLoading(false);
    return false;
  } else {
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${redirectURL}?status=APPROVED`,
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error") {
      showMessage(error.message);
    } else {
      showMessage("An unexpected error occur");
    }

    setLoading(false);
  }
}

// ------- UI helpers -------

function showMessage(messageText) {
  const messageContainer = document.querySelector("#payment-message");

  messageContainer.classList.remove("hidden");
  messageContainer.textContent = messageText;

  setTimeout(function () {
    messageContainer.classList.add("hidden");
    messageText.textContent = "";
  }, 4000);
}

// Show a spinner on payment submission
function setLoading(isLoading) {
  if (isLoading) {
    // Disable the button and show a spinner
    document.querySelector("#submit").disabled = true;
    document.querySelector("#spinner").classList.remove("hidden");
    document.querySelector("#button-text").classList.add("hidden");
  } else {
    document.querySelector("#submit").disabled = false;
    document.querySelector("#spinner").classList.add("hidden");
    document.querySelector("#button-text").classList.remove("hidden");
  }
}
