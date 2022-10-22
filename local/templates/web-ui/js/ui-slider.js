class UISLider {
    constructor(domElement, params = {}) {
        this.domElement = domElement;
        this.params = params;
        this.arSlides = [];
        this.arDots = [];
        if (domElement === null) return false;

        this.init()
    }

    init() {
        this.__findSlides();
        this.__initDots();

    }

    __findSlides() {
        let slides = this.domElement.querySelectorAll(':scope > [data-ui-slider-list] > div');

        slides.forEach((slide, index) => {
            this.__addSlideId(slide, index);
            this.__setSlideWidth(slide);
            this.__setSlidePadding(slide);

            this.arSlides[index] = slide;
        });


    }

    __addSlideId(slide, id = 0) {
        slide.dataset.uiSliderId = id;

    }

    __setSlideWidth(slide, count = this.params.slidesToShow) {

        let width = '0 0 calc(100% / ' + count + ')'

        slide.style.flex = width;
    }

    __setSlidePadding(slide, padding = this.params.slidesMargin) {
        slide.style.padding = padding;
    }

    __initDots() {
        let dotsContainer = this.domElement.querySelector(':scope > [data-ui-slider-nav]');

        if (!dotsContainer) {
            // :TODO
            // this.domElement.createElement
        }

        this.__createDotsHtml(dotsContainer);
        this.__addDotsEvent(dotsContainer);

    }

    __createDotsHtml(dotsContainer) {
        let nav = document.createElement('nav'),
            ul = document.createElement('ul');

        nav.appendChild(ul);

        this.arSlides.forEach((element, index) => {
            let li = document.createElement('li');
            li.className = 'ui-slider-dot';
            li.dataset.uiSliderDot = index;

            ul.appendChild(li);

            this.arDots[index] = li;
        });

        dotsContainer.append(nav);

        this.__addDotsEvent()
    }

    __addDotsEvent(dotsContainer) {

        let dots = this.domElement.querySelectorAll(':scope [data-ui-slider-dot]');
        let $athis = this;

        console.log(dots)
        dots.forEach(element => {
            element.onclick = function (e) {
                $athis.slideTo(element.dataset.uiSliderDot);
            };
        });
    }

    slideTo(index) {

        let track = this.domElement.querySelector(':scope  [data-ui-slider-list]');

        track.style.transform = 'translateX(-'+this.arSlides[index].offsetLeft+'px)'

        this.__slideActive(index);
    }

    __slideActive(index){

        this.arSlides[index].classList.add('active');
        this.arDots[index].classList.add('active');
    }
}