class UISLider {
    constructor(domElement, params = {}) {
        if (domElement === null) return false;

        this.domElement = domElement;
        this.params = params;
        this.arSlides = [];
        this.arDots = [];
        this.curSlide = 0;

        this.init()
    }

    init() {
        this.__findSlides();
        this.__initDots();

        this.__initSwap();

        this.__initObserver();
    }

    __findSlides() {
        let slides = this.domElement.querySelectorAll(':scope > [data-ui-slider-list] > div');

        slides.forEach((slide, index) => {
            this.__addSlideId(slide, index);

            if (!this.params.useCssProfile) {
                this.__setSlideWidth(slide);
                this.__setSlidePadding(slide);
            }


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
        this.__addDotsEvent();

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

    }

    __addDotsEvent() {

        let dots = this.domElement.querySelectorAll(':scope [data-ui-slider-dot]');
        let $athis = this;

        dots.forEach(element => {
            element.onclick = function (e) {
                $athis.slideTo(element.dataset.uiSliderDot);
            };
        });
    }

    slideTo(index) {

        let track = this.domElement.querySelector(':scope  [data-ui-slider-list]');

        track.classList.remove('ui-slider-list--disableAnimation');

        track.style.transform = 'translateX(-' + this.arSlides[index].offsetLeft + 'px)'

        this.__slideActive(index);

        this.curSlide = index;
    }

    __slideActive(index) {

        this.arSlides[index].classList.add('active');
        this.arDots[index].classList.add('active');
    }

    resize() {
        let track = this.domElement.querySelector(':scope  [data-ui-slider-list]');

        // let transitionDuration = window.getComputedStyle(track).transitionDuration;

        track.classList.add('ui-slider-list--disableAnimation')

        track.style.transform = 'translateX(-' + this.arSlides[this.curSlide].offsetLeft + 'px)';
    }

    __initObserver() {
        const ro = new ResizeObserver(entries => {
            this.resize()
        })

        ro.observe(this.domElement)
    }

    // Swipe

    getEvent(event) {
        return event.type.search('touch') !== -1 ? event.touches[0] : event;
    }

    __initSwap() {
        this.posInit = 0;
        this.posX1 = 0;
        this.posX2 = 0;
        this.posFinal = 0;
        this.posThreshold = this.arSlides[0].offsetWidth * .35;
        this.trfRegExp = /[-0-9.]+(?=px)/;

        
        this.swipeAction = this.swipeAction.bind(this);
        this.swipeEnd = this.swipeEnd.bind(this);

        let track = this.domElement.querySelector(':scope  [data-ui-slider-list]');

        track.addEventListener('touchstart',  this.swipeStart.bind(this));
        track.addEventListener('mousedown', this.swipeStart.bind(this));
    }

    swipeStart(event) {
        let evt = this.getEvent(event);

        this.posInit = this.posX1 = evt.clientX;

        console.log(this.posInit)

        let track = this.domElement.querySelector(':scope  [data-ui-slider-list]');
        track.classList.add('ui-slider-list--disableAnimation');

        document.addEventListener('touchmove', this.swipeAction );
        document.addEventListener('touchend', this.swipeEnd);

        document.addEventListener('mousemove', this.swipeAction);
        document.addEventListener('mouseup', this.swipeEnd);

    }

    swipeAction(event) {
        let evt = this.getEvent(event);

        let track = this.domElement.querySelector(':scope  [data-ui-slider-list]');

        let style = track.style.transform,

            transform = +style.match(this.trfRegExp)[0];

        this.posX2 = this.posX1 - evt.clientX;
        this.posX1 = evt.clientX;

        console.log(this.posX2, this.posX1)

        track.style.transform = `translate3d(${transform - this.posX2}px, 0px, 0px)`;

    }

    swipeEnd(event) {
        this.posFinal = this.posInit - this.posX1;

        document.removeEventListener('touchmove', this.swipeAction);
        document.removeEventListener('mousemove', this.swipeAction);

        document.removeEventListener('touchend', this.swipeEnd);
        document.removeEventListener('mouseup', this.swipeEnd);

        if (Math.abs(this.posFinal) > this.posThreshold) {
            if (this.posInit < this.posX1) {
                this.curSlide--;
            } else if (this.posInit > this.posX1) {
                this.curSlide++;
            }
        }

        if(this.curSlide <= 0){ this.curSlide = 0} 

        if(this.curSlide >= this.arSlides.length) {this.curSlide = this.arSlides.length - 1}

        this.slideTo(this.curSlide);
    }
}