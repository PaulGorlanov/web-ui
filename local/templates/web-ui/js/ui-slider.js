class UISLider {
    constructor(domElement, params = {}) {
        this.domElement = domElement;
        this.params = params;

        if(domElement === null) return false;

        this.init()
    }
    
    init() {
        this.__findSlides();
        
    }

    __findSlides(){
        let slides = this.domElement.querySelectorAll(':scope > [data-ui-slider-list] > div');

        slides.forEach((slide, index) => {
            this.__addSlideId(slide, index);
            this.__setSlideWidth(slide);
            this.__setSlidePadding(slide);
        });

    }

    __addSlideId(slide, id = 0){
        slide.dataset.uiSliderId = id;
        
    }

    __setSlideWidth(slide, count = this.params.slidesToShow){

        let width = '0 0 calc(100% / '+ count +')'

        slide.style.flex = width;
    }

    __setSlidePadding(slide, padding = this.params.slidesMargin){
        slide.style.padding = padding;
    }
}