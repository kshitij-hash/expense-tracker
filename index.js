import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

import firebaseConfig from "./config.js";

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const reference = ref(database, "users");
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const keypadContainer = document.getElementsByClassName('keypad')
const keypadButtons = Array.from(keypadContainer[0].children).slice(0,10);
const loginWithGoogleBtn = document.getElementById('login-btn')

keypadButtons.forEach(button => {
    const value = button.textContent;
    button.addEventListener('click', () => {
        addToExpense(value);
    })
})

const viewLoggedIn = document.getElementById('view-logged-in');
const viewUserInfo = document.getElementById('view-user-info');
const viewLoggedOut = document.getElementById('view-logged-out');

const logOutButton = document.getElementById('logout-btn');

const expensesList = document.getElementById('list');
let total_expenses = 0;
let total_expenses_field = document.getElementById('total-expenses');

onAuthStateChanged(auth, (user) => {
    if(user) {
        showViewLoggedIn();
        const displayName = user.displayName.split(' ')[0];
        let userName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
        document.getElementById('user-name').innerHTML = `<i class="fa-solid fa-user"></i> ${userName}`;
        const userId = user.uid;
        const userReference = ref(database, `users/${userId}/expenses`);
        onValue(userReference, (snapshot) => {
            let noExpensesMsg = document.getElementById('no-item-msg');
            if(snapshot.exists()) {
                clearExpenseList();
                noExpensesMsg.style.display = 'none';
                total_expenses = 0;
                const expensesArray = Object.entries(snapshot.val());
                expensesArray.forEach(expense => {
                    appendList(expense);
                })
            } else {
                clearExpenseList();
                total_expenses_field.innerHTML = `&#8377; 0`
                noExpensesMsg.style.display = 'block';
            }
        })
    } else {
        showViewLoggedOut();
    }
})

loginWithGoogleBtn.addEventListener('click', () => {
    signInWithPopup(auth, provider)
    .then((result) => {
        const displayName = result.user.displayName.split(' ')[0]
        let userName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
        document.getElementById('user-name').innerHTML = `<i class="fa-solid fa-user"></i> ${userName}`;
        showViewLoggedIn();
    }).catch(() => {
        showViewLoggedOut();
    });
})

function showViewLoggedIn() {
    viewLoggedIn.classList.remove('hidden')
    viewUserInfo.classList.remove('hidden')
    viewLoggedOut.classList.add('hidden')
}

function showViewLoggedOut() {
    viewLoggedIn.classList.add('hidden')
    viewUserInfo.classList.add('hidden')
    viewLoggedOut.classList.remove('hidden')
}

logOutButton.addEventListener('click', () => {
    signOut(auth);
})

function addToExpense(value) {
    let expenseField = document.getElementById('expense');
    let currentExpense = parseInt(expenseField.innerHTML.replace('₹ ', ''));
    let newExpense = parseInt(currentExpense + value);

    if (!isNaN(currentExpense) && currentExpense !== 0) {
        if(newExpense > 100000) {
            return;
        }
        expenseField.innerHTML = '&#8377; ' + (currentExpense + value);
    } else {
        if(newExpense > 100000) {
            return;
        }
        expenseField.innerHTML = '&#8377; ' + value;
    }
}

let backspaceBtn = document.getElementById('backspace-btn');
backspaceBtn.addEventListener('click', removeFromExpense);

function removeFromExpense() {
    let expenseField = document.getElementById('expense');
    let currentExpense = parseInt(expenseField.innerHTML.replace('₹ ', ''));

    if (!isNaN(currentExpense)) {
        expenseField.innerHTML = '&#8377; ' + Math.floor(currentExpense / 10);
    } else {
        expenseField.innerHTML = '&#8377; 0';
    }
}

let crossBtn = document.getElementById('cross-btn');
crossBtn.addEventListener('click', resetItem);

function resetItem() {
    let expenseField = document.getElementById('expense');
    let itemField = document.getElementById('item');
    
    itemField.value = '';
    expenseField.innerHTML = '&#8377; 0';
}

let submitBtn = document.getElementById('submit-btn')
submitBtn.addEventListener('click', submitExpense);

function appendList(expense) {
    let expenseItem = document.createElement('li');
    total_expenses += expense[1].expense;
    expenseItem.textContent = `${expense[1].item} - ₹ ${expense[1].expense}`;
    expensesList.appendChild(expenseItem);
    total_expenses_field.innerHTML = `&#8377; ${total_expenses}`

    const expenseId = expense[0];
    expenseItem.addEventListener('dblclick', () => {
        const userId = auth.currentUser.uid;
        const locationOfExpense = ref(database, `users/${userId}/expenses/${expenseId}`)
        remove(locationOfExpense);
    })
}

function clearExpenseList() {
    expensesList.innerHTML = '';
}

function submitExpense() { 
    let expenseField = document.getElementById('expense');
    let itemField = document.getElementById('item');

    if(expenseField.innerText === '₹ 0' || itemField.value.trim() === '') {
        return;
    }

    const userId = auth.currentUser.uid;
    let expenseObject = {
        item: itemField.value.trim(),
        expense: parseInt(expenseField.innerText.replace('₹ ', '')),
    }

    let userReference = ref(database, `users/${userId}/expenses`);
    push(userReference, expenseObject);
    resetItem();
}

function formatDateWithSuffix(date) {
    const suffixes = ["th", "st", "nd", "rd"];
    
    if(date > 3 && date < 21) {
        return date + suffixes[0];
    }
    return date + suffixes[date % 10];
}

const daysOfWeek = ["SUN", "MON", "TUES", "WED", "THURS", "FRI", "SAT"];
const monthsOfYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

let dateField = document.getElementById('date');
let previousDate = null;

function getCurrentDate() {
    let current_date = new Date();

    let date = current_date.getDate();
    let day = current_date.getDay();
    let month = current_date.getMonth();
    let year = current_date.getFullYear();

    let dateWithSuffix = formatDateWithSuffix(date);

    let currentDateStr = `${daysOfWeek[day]} ${dateWithSuffix} ${monthsOfYear[month]} ${year}`

    if(currentDateStr !== previousDate) {
        dateField.textContent = currentDateStr;
        previousDate = currentDateStr;
    }
}

setInterval(getCurrentDate, 1000);