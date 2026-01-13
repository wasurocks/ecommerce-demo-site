console.clear();

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2)
    return parts.pop().split(';').shift();
  else
    return false
}

if(getCookie('counter')>=0)
{
    let counter = getCookie('counter')
    document.getElementById("badge").innerHTML = counter
}


let cartContainer = document.getElementById('cartContainer')

let boxContainerDiv = document.createElement('div')
boxContainerDiv.id = 'boxContainer'

// DYNAMIC CODE TO SHOW THE SELECTED ITEMS IN YOUR CART
function dynamicCartSection(ob,itemCounter)
{
    let boxDiv = document.createElement('div')
    boxDiv.id = 'box'
    boxContainerDiv.appendChild(boxDiv)

    let boxImg = document.createElement('img')
    boxImg.src = ob.preview
    boxDiv.appendChild(boxImg)

    let detailsDiv = document.createElement('div')
    detailsDiv.className = 'cart-item-details'
    boxDiv.appendChild(detailsDiv)

    let boxh3 = document.createElement('h3')
    let h3Text = document.createTextNode(ob.name)
    boxh3.appendChild(h3Text)
    detailsDiv.appendChild(boxh3)

    let brandDiv = document.createElement('p')
    brandDiv.style.cssText = 'color: var(--color-text-secondary); font-size: var(--font-size-sm); margin: var(--space-1) 0;'
    let brandText = document.createTextNode(ob.brand || 'Brand Name')
    brandDiv.appendChild(brandText)
    detailsDiv.appendChild(brandDiv)

    let boxh4 = document.createElement('h4')
    let h4Text = document.createTextNode('Rs ' + ob.price + ' × ' + itemCounter)
    boxh4.appendChild(h4Text)
    detailsDiv.appendChild(boxh4)

    let subtotalDiv = document.createElement('p')
    subtotalDiv.style.cssText = 'color: var(--color-text-primary); font-weight: var(--font-weight-semibold); margin-top: var(--space-3);'
    let subtotalText = document.createTextNode('Subtotal: Rs ' + (ob.price * itemCounter))
    subtotalDiv.appendChild(subtotalText)
    detailsDiv.appendChild(subtotalDiv)

    buttonLink.appendChild(buttonText)
    cartContainer.appendChild(boxContainerDiv)
    cartContainer.appendChild(totalContainerDiv)

    return cartContainer
}

let totalContainerDiv = document.createElement('div')
totalContainerDiv.id = 'totalContainer'

let totalDiv = document.createElement('div')
totalDiv.id = 'total'
totalContainerDiv.appendChild(totalDiv)

let totalh2 = document.createElement('h2')
let h2Text = document.createTextNode('Order Summary')
totalh2.appendChild(h2Text)
totalDiv.appendChild(totalh2)

// Customer info form
let customerInfoDiv = document.createElement('div')
customerInfoDiv.className = 'customer-info-form'

let nameLabel = document.createElement('label')
nameLabel.htmlFor = 'customerName'
nameLabel.textContent = 'Full Name'
customerInfoDiv.appendChild(nameLabel)

let nameInput = document.createElement('input')
nameInput.type = 'text'
nameInput.id = 'customerName'
nameInput.placeholder = 'Enter your full name'
nameInput.required = true
customerInfoDiv.appendChild(nameInput)

let emailLabel = document.createElement('label')
emailLabel.htmlFor = 'customerEmail'
emailLabel.textContent = 'Email Address'
customerInfoDiv.appendChild(emailLabel)

let emailInput = document.createElement('input')
emailInput.type = 'email'
emailInput.id = 'customerEmail'
emailInput.placeholder = 'Enter your email address'
emailInput.required = true
customerInfoDiv.appendChild(emailInput)

totalDiv.appendChild(customerInfoDiv)

// TO UPDATE THE TOTAL AMOUNT
function amountUpdate(amount)
{
    let totalh4 = document.createElement('h4')
    let totalh4Text = document.createTextNode('Rs ' + amount)
    totalh4Text.id = 'toth4'
    totalh4.appendChild(totalh4Text)
    totalDiv.appendChild(totalh4)
    totalDiv.appendChild(buttonDiv)
    console.log(totalh4);
}


let buttonDiv = document.createElement('div')
buttonDiv.id = 'button'
totalDiv.appendChild(buttonDiv)

let buttonTag = document.createElement('button')
buttonDiv.appendChild(buttonTag)

let buttonLink = document.createElement('a')
buttonLink.href = '/orderPlaced.html?'
buttonTag.appendChild(buttonLink)

buttonText = document.createTextNode('Place Order')
buttonTag.onclick = function(e)
{
    let name = document.getElementById('customerName').value.trim()
    let email = document.getElementById('customerEmail').value.trim()

    if (!name || !email) {
        e.preventDefault()
        alert('Please enter your name and email address before placing the order.')
        return false
    }

    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        e.preventDefault()
        alert('Please enter a valid email address.')
        return false
    }

    buttonLink.href = '/orderPlaced.html?name=' + encodeURIComponent(name) + '&email=' + encodeURIComponent(email)
    console.log("clicked")
}
//dynamicCartSection()
// console.log(dynamicCartSection());

// BACKEND CALL
let httpRequest = new XMLHttpRequest()
let totalAmount = 0
httpRequest.onreadystatechange = function()
{
    if(this.readyState === 4)
    {
        if(this.status == 200)
        {
            // console.log('call successful');
            contentTitle = JSON.parse(this.responseText)

            let counter = Number(getCookie('counter'))
            document.getElementById("totalItem").innerHTML = ('Total Items: ' + counter)

            let item = getCookie('orderId').split(" ")
            console.log(counter)
            console.log(item)

            let i;
            let totalAmount = 0
            for(i=0; i<counter; i++)
            {
                let itemCounter = 1
                for(let j = i+1; j<counter; j++)
                {
                    if(Number(item[j]) == Number(item[i]))
                    {
                        itemCounter +=1;
                    }
                }
                totalAmount += Number(contentTitle[item[i]-1].price) * itemCounter
                dynamicCartSection(contentTitle[item[i]-1],itemCounter)
                i += (itemCounter-1)
            }
            amountUpdate(totalAmount)
        }
    }
        else
        {
            console.log('call failed!');
        }
}

httpRequest.open('GET', 'https://5d76bf96515d1a0014085cf9.mockapi.io/product', true)
httpRequest.send()
