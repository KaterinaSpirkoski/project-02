function initVisitorsPage() {
  updateHeader();
}
function initVisitorGallery() {
  let imagesSource = [
    "././images/sliders images/img1.png",
    "././images/sliders images/img2.jpg",
    "././images/sliders images/img3.jpg",
    "././images/sliders images/img4.png",
    "././images/sliders images/img5.png",
    "././images/sliders images/img6.jpg",
    "././images/sliders images/img7.png",
    "././images/sliders images/img8.jpg",
  ];

  function createImageGallery(images, parentElement) {
    let imgElements = images.map(function (src, index) {
      let linkImg = document.createElement("a");
      let img = document.createElement("img");
      img.src = src;
      img.alt = "Image " + (index + 1);
      img.width = 207.62;
      img.height = 153;
      img.classList.add("img-slider");
      linkImg.appendChild(img);
      linkImg.href = "#visitors-listing";
      return linkImg;
    });

    imgElements.forEach(function (linkImg) {
      parentElement.appendChild(linkImg);
    });
  }

  let sliderContainer1 = document.querySelector(".first-row");
  createImageGallery(imagesSource, sliderContainer1);

  let sliderContainer2 = document.querySelector(".second-row");
  createImageGallery(imagesSource, sliderContainer2);
}
