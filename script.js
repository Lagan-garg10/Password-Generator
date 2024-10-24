const inputSlider = document.querySelector('[password-length-slider]')
const lengthDisplay = document.querySelector('[pasword-length-number]')
const passwordDisplay = document.querySelector('[data-password-display]')
const copyBtn = document.querySelector('[password-copy-btn]')
const copyMsg = document.querySelector('[password-copy-message]')
const uppercaseCheck = document.querySelector('#uppercase')
const lowercaseCheck = document.querySelector('#lowercase')
const numbersCheck = document.querySelector('#numbers')
const symbolsCheck = document.querySelector('#symbols')
const passwordIndicator = document.querySelector('[password-indicator]')
const generateBtn = document.querySelector('.generateButton')
const allCheckBox = document.querySelectorAll('input[type=checkBox]')

let password = ''
let passwordLength = 10
let checkCount = 0

handleSlider()

// set password length
function handleSlider() {
    inputSlider.value = passwordLength
    lengthDisplay.innerText = passwordLength
}

function setIndicator(color) {
    passwordIndicator.style.backgroundColor = color
}

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}

function generateRandomNumber() {
    return getRandomInteger(0, 9)
}

function generateLowerCase() {
    return String.fromCharCode(getRandomInteger(97, 123))
}

function generateUpperCase() {
    return String.fromCharCode(getRandomInteger(65, 91))
}

function generateSymbol() {
    const symbolRanges = [
        { min: 33, max: 48 },
        { min: 58, max: 65 },
        { min: 91, max: 97 },
        { min: 123, max: 127 }
    ]
    const selectedRange = symbolRanges[getRandomInteger(0, symbolRanges.length)];
    return String.fromCharCode(getRandomInteger(selectedRange.min, selectedRange.max));
}

function calculateStrength() {
    let strength = 0;
    
    // Check for each type and add to the strength score
    if (uppercaseCheck.checked) strength++;
    if (lowercaseCheck.checked) strength++;
    if (numbersCheck.checked) strength++;
    if (symbolsCheck.checked) strength++;

    // Adjust password length
    const lengthScore = passwordLength >= 8 ? 2 : passwordLength >= 5 ? 1 : 0;

    // Determine password strength based on combinations and length
    if (strength >= 4 && passwordLength > 14) {
        setIndicator('#006400'); // Very strong (dark green)
    } else if (strength >= 3 && passwordLength > 10) {
        setIndicator('#32CD32'); // Strong (light green)
    } else if (strength >= 2 && lengthScore > 0) {
        setIndicator('#FFA500'); // Medium (orange)
    } else {
        setIndicator('#FF4C4C'); // Weak (red)
    }
}


async function copyPassword() {
    try {
        await navigator.clipboard.writeText(password)
        copyMsg.innerText = 'Copied'
    }
    catch (e) {
        copyMsg.innerText = 'Failed'
    }
    copyMsg.classList.add('active')
    setTimeout(()=>{
        copyMsg.classList.remove('active')
    },2000)
}

function handleCheckBoxChange(){
    checkCount = 0
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount++
        }
    })

    // Special Condition
    if(passwordLength < checkCount){
        passwordLength = checkCount
        handleSlider()
    }
}

function shufflePassword(arr){
    // Fisher Yates Method
    for (let i=arr.length-1; i>0;i--){
        // finding random number
        const j = Math.floor(Math.random()*(i+1))

        // swapping
        const temp = arr[i]
        arr[i] = arr[j]
        arr[j] = temp
    }
    let str = ''
    arr.forEach((el)=>{
        str += el
    })
    return str
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change', handleCheckBoxChange)
})

inputSlider.addEventListener('input', (e)=>{
    passwordLength = e.target.value
    handleSlider()
})

copyBtn.addEventListener('click', ()=>{
    if(passwordDisplay.value){
        copyPassword()
    }
})

generateBtn.addEventListener('click', ()=>{
    if(checkCount <= 0){
        return
    }
    if(passwordLength < checkCount){
        passwordLength = checkCount
        handleSlider()
    }
    password = ''
    let functionArray = []
    if(uppercaseCheck.checked){
        functionArray.push(generateUpperCase)
    }
    if(lowercaseCheck.checked){
        functionArray.push(generateLowerCase)
    }
    if(numbersCheck.checked){
        functionArray.push(generateRandomNumber)
    }
    if(symbolsCheck.checked){
        functionArray.push(generateSymbol)
    }

    // compulsory addition
    for (let i=0; i<functionArray.length;i++){
        password += functionArray[i]()
    }

    // remaining addition
    for (let i=0; i<passwordLength-functionArray.length;i++){
        let randomIndex = getRandomInteger(0, functionArray.length)
        password += functionArray[randomIndex]()
    }

    // shuffle password
    password = shufflePassword(Array.from(password))

    // show in UI
    passwordDisplay.value = password

    // strength calculate
    calculateStrength()
})