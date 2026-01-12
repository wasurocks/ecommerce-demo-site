// console.clear();

let contentTitle;

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2)
    return parts.pop().split(';').shift();
  else
    return false
}


function dynamicClothingSection(ob) {
  let boxDiv = document.createElement("div");
  boxDiv.id = "box";

  let boxLink = document.createElement("a");
  // boxLink.href = '#'
  boxLink.href = "/contentDetails.html?" + ob.id;
  // console.log('link=>' + boxLink);

  let imgTag = document.createElement("img");
  // imgTag.id = 'image1'
  // imgTag.id = ob.photos
  imgTag.src = ob.preview;

  let detailsDiv = document.createElement("div");
  detailsDiv.id = "details";

  let h3 = document.createElement("h3");
  let h3Text = document.createTextNode(ob.name);
  h3.appendChild(h3Text);

  let h4 = document.createElement("h4");
  let h4Text = document.createTextNode(ob.brand);
  h4.appendChild(h4Text);

  let h2 = document.createElement("h2");
  let h2Text = document.createTextNode("rs  " + ob.price);
  h2.appendChild(h2Text);

  boxDiv.appendChild(boxLink);
  boxLink.appendChild(imgTag);
  boxLink.appendChild(detailsDiv);
  detailsDiv.appendChild(h3);
  detailsDiv.appendChild(h4);
  detailsDiv.appendChild(h2);

  return boxDiv;
}

//  TO SHOW THE RENDERED CODE IN CONSOLE
// console.log(dynamicClothingSection());

// console.log(boxDiv)

let mainContainer = document.getElementById("mainContainer");
let containerClothing = document.getElementById("containerClothing");
let containerAccessories = document.getElementById("containerAccessories");

// Loading skeleton function
function createSkeletonBox() {
  let skeletonBox = document.createElement("div");
  skeletonBox.className = "skeleton-box";

  let skeletonImage = document.createElement("div");
  skeletonImage.className = "skeleton-image";

  let skeletonDetails = document.createElement("div");
  skeletonDetails.className = "skeleton-details";

  let titleLine = document.createElement("div");
  titleLine.className = "skeleton-line title";

  let brandLine = document.createElement("div");
  brandLine.className = "skeleton-line brand";

  let priceLine = document.createElement("div");
  priceLine.className = "skeleton-line price";

  skeletonBox.appendChild(skeletonImage);
  skeletonBox.appendChild(skeletonDetails);
  skeletonDetails.appendChild(titleLine);
  skeletonDetails.appendChild(brandLine);
  skeletonDetails.appendChild(priceLine);

  return skeletonBox;
}

// Show loading skeletons
for (let i = 0; i < 5; i++) {
  containerClothing.appendChild(createSkeletonBox());
  containerAccessories.appendChild(createSkeletonBox());
}

// BACKEND CALLING

let httpRequest = new XMLHttpRequest();

httpRequest.onreadystatechange = function() {
  if (this.readyState === 4) {
    if (this.status == 200) {
      // console.log('call successful');
      contentTitle = JSON.parse(this.responseText);

      // Clear loading skeletons
      containerClothing.innerHTML = '';
      containerAccessories.innerHTML = '';

      if (getCookie('counter') && getCookie('counter')>=0) {
        var counter = getCookie('counter');
        document.getElementById("badge").innerHTML = counter;
      }
      for (let i = 0; i < contentTitle.length; i++) {
        if (contentTitle[i].isAccessory) {
          console.log(contentTitle[i]);
          containerAccessories.appendChild(
            dynamicClothingSection(contentTitle[i])
          );
        } else {
          console.log(contentTitle[i]);
          containerClothing.appendChild(
            dynamicClothingSection(contentTitle[i])
          );
        }
      }
    } else {
      console.log("call failed!");
      // Clear skeletons and show error
      containerClothing.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--color-error);">Failed to load products. Please try again.</p>';
      containerAccessories.innerHTML = '';
    }
  }
};
httpRequest.open(
  "GET",
  "https://5d76bf96515d1a0014085cf9.mockapi.io/product",
  true
);
httpRequest.send();
