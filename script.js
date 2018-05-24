// Initialize Firebase
const config = {
  apiKey: "AIzaSyCR1x2fhI8w32yz_74KeAQjnvknhZfsqzs",
  authDomain: "contactform-d9287.firebaseapp.com",
  databaseURL: "https://contactform-d9287.firebaseio.com",
  projectId: "contactform-d9287",
  storageBucket: "contactform-d9287.appspot.com",
  messagingSenderId: "769566872950"
};
firebase.initializeApp(config);

// Reference messages collection
const messagesRef = firebase.database().ref('messages');

const openSlideButton = document.getElementById('open-slide')
const closeSlideButton = document.getElementById('close-slide')
const sideNavLink = document.getElementsByClassName('side-nav-link')
const cardSummary = document.getElementsByClassName('card-summary')
const summaryButton = document.getElementsByClassName('card-summary-btn')
const cardDetail = document.getElementsByClassName('card-detail')
const closeCardButton = document.getElementsByClassName('card-close-btn')
const contactButton = document.getElementsByClassName('contact-btn')
const closeForm = document.getElementById('close-form')
const endpoint = "https://oo52c9psl9.execute-api.us-east-2.amazonaws.com/prod/ContactFormLambda"
const captchaEndpoint = "http://localhost:3000/contact"

// Side navigation functions
const openSlideMenu = () => {
  document.getElementById('side-menu').style.width = '250px';
  document.getElementById('main').style.marginLeft = '250px';
  console.log('open');
}

const closeSlideMenu = () => {
  document.getElementById('side-menu').style.width = '0';
  document.getElementById('main').style.marginLeft = '0';
  console.log('close');
}

openSlideButton.addEventListener("click", openSlideMenu);
closeSlideButton.addEventListener("click", closeSlideMenu);

for (let i = 0; i < sideNavLink.length; i++) {
  sideNavLink[i].addEventListener("click", closeSlideMenu)
}

// Card behavior functions
const openCardDetail = (i) => {
  return () => {
    console.log(cardSummary[i])
    cardSummary[i].style.display = "none"
    cardDetail[i].style.display = "block"
  }
}

const closeCardDetail = (i) => {
  return () => {
    cardSummary[i].style.display = "block"
    cardDetail[i].style.display = "none"
  }
}

for (let i = 0; i < cardDetail.length; i++) {
  summaryButton[i].addEventListener("click", openCardDetail(i))
  closeCardButton[i].addEventListener("click", closeCardDetail(i))
}

// Contact Form Handling
// Save message to firebase
const saveMessage = (name, company, email, phone, message) => {
  const newMessageRef = messagesRef.push()
  newMessageRef.set({
    name: name,
    company: company,
    email: email,
    phone: phone,
    message: message
  })
}

// Function to get form values
const getInputVal = (id) => {
  return document.getElementById(id).value
}

const openContactForm = () => {
  document.getElementById('contact').style.width = '90%'
  document.getElementById('main').style.marginLeft = '-60%'
  console.log('open')
}

const closeContactForm = () => {
  document.getElementById('contact').style.width = '0'
  document.getElementById('main').style.marginLeft = '0'
  document.getElementsByTagName('form')[0].style.display = 'grid'
  console.log('close')
}

// Contact form handling
// Get input values
const name = getInputVal('name')
const company = getInputVal('company')
const email = getInputVal('email')
const phone = getInputVal('phone')
const message = getInputVal('message')
const captcha = getInputVal('g-recaptcha-response')

const recaptchaRequest = () => {
  fetch('/contact', {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-type': 'application/json'
    },
    body: JSON.stringify({ name: name, email: email, captcha: captcha })
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
      alert(data.msg)
    })
}

const submitForm = (e) => {
  e.preventDefault();

  saveMessage(name, company, email, phone, message)
  recaptchaRequest()

  const body = {
    name: name,
    company: company,
    email: email,
    phone: phone,
    subject: 'From WILFREMORGAN.COM',
    message: message
  }

  const lambdaRequest = new Request(endpoint, {
    method: 'POST',
    // NOTE: change this setting in production
    mode: 'no-cors',
    body: JSON.stringify(body)
  })

  fetch(lambdaRequest)
    .then(response => console.log(response))
    .catch(err => console.log(err))

  // Hide form
  hideForm()

}

const hideForm = () => {
  document.getElementById('contact-me').reset()
  document.querySelector('.alert').style.display = 'block'
  document.getElementsByTagName('form')[0].style.display = 'none'

  setTimeout(() => {
    document.querySelector('.alert').style.display = 'none'
    closeContactForm()
  }, 5000)
}

const submitted = false;
const hideiFrame = () => {
  if (submitted) {
    return null;
  }
}

for (let i = 0; i < contactButton.length; i++) {
  contactButton[i].addEventListener("click", openContactForm)
}
closeForm.addEventListener("click", closeContactForm)

document.getElementById('contact-me').addEventListener('submit', submitForm)

