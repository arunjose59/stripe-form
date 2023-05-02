// This is a public sample test API key.
// Don’t submit any personally identifiable information in requests made with this key.
// Sign in to see your own test API key embedded in code samples.
const stripe = Stripe(
  "pk_test_51Mnj6qJvSEcHrCnhXfffmy7VM5IhrlMDgGxaaegmxtufPTIQ296TQvuxPy0S2HAMnlWCvWYu048HgKjLXpbLRhFB00YbtDFOFC"
);

let elements;

initialize();

document
  .querySelector("#payment-form")
  .addEventListener("submit", handleSubmit);

// Fetches a payment intent and captures the client secret
async function initialize() {
  const clientSecret =
    "pi_3N3DERJvSEcHrCnh0YydLbmL_secret_fLMY90n8lci8a5T17GKIyRX40";

  const appearance = {
    theme: "stripe",
  };
  elements = stripe.elements({ appearance, clientSecret });

  // const linkAuthenticationElement = elements.create("linkAuthentication");
  // linkAuthenticationElement.mount("#link-authentication-element");

  // linkAuthenticationElement.on("change", (event) => {
  //   emailAddress = event.value.email;
  // });

  const paymentElementOptions = {
    layout: "tabs",
  };

  const paymentElement = elements.create("payment", paymentElementOptions);
  paymentElement.mount("#payment-element");
}

async function handleSubmit(e) {
  e.preventDefault();
  setLoading(true);

  const { error } = await stripe.confirmPayment({
    elements,
    confirmParams: {
      // Make sure to change this to your payment completion page
      return_url: `https://www.google.com/?status=APPROVED`,
    },
  });

  // This point will only be reached if there is an immediate error when
  // confirming the payment. Otherwise, your customer will be redirected to
  // your `return_url`. For some payment methods like iDEAL, your customer will
  // be redirected to an intermediate site first to authorize the payment, then
  // redirected to the `return_url`.
  // if (error.type === "card_error" || error.type === "validation_error") {
  if (error.type === "card_error") {
    showMessage(error.message);
  } else {
    showMessage("An unexpected error occurred.");
  }

  setLoading(false);
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
