// Проверка поддержки webp
function testWebP(callback) {
    let webP = new Image();
    webP.onload = webP.onerror = function () {
        callback(webP.height == 2);
    };
    webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}
// Добавление класса _webp или _no-webp для HTML
testWebP(function (support) {
    let className = support === true ? 'webp' : 'no-webp';
    document.documentElement.classList.add(className);
});

const sensor = !!('ontouchstart' in window)

// Lazyload
const lazyImages = document.querySelectorAll('img[data-src]')
if (lazyImages.length > 0) {
    lazyImages.forEach(img => {
        function showImg() {
            const { top } = img.getBoundingClientRect()
            if (top < window.innerHeight) {
                img.setAttribute('src', img.dataset.src)
                document.removeEventListener('scroll', showImg)
            }
        }
        showImg()
        document.addEventListener('scroll', showImg)
    })
}

// Шапка
const header = document.querySelector('.header')
const headerContainer = header.querySelector('.header .page__container')
const burger = header.querySelector('.header__burger')
if (!sensor) {
    burger.addEventListener('mouseenter', () => header.classList.add('open-menu'))
    headerContainer.addEventListener('mouseleave', () => header.classList.remove('open-menu'))
} else {
    burger.addEventListener('click', () => header.classList.toggle('open-menu'))
    if (window.innerWidth <= 820) burger.dataset.pointer = 'header-mobile'
    document.addEventListener('click', ({ target }) => !headerContainer.contains(target) ? header.classList.remove('open-menu') : '')
}

// Баннер параллакс
const banner = document.querySelector('.banner')
if (banner) {
    document.addEventListener('scroll', (e) => {
        const scrollPosition = document.documentElement.scrollTop
        banner.style.backgroundPositionY = `calc(50% + ${scrollPosition}px)`
        scrollPosition == 0 ? banner.style.backgroundPositionY = 'center' : ''
    })
}



/* Маска */
window.addEventListener("DOMContentLoaded", function () {
    [].forEach.call(document.querySelectorAll('.tel'), function (input) {
        var keyCode;
        function mask(event) {
            event.keyCode && (keyCode = event.keyCode);
            var pos = this.selectionStart;
            if (pos < 3) event.preventDefault();
            var matrix = "+7 (___) ___-__-__",
                i = 0,
                def = matrix.replace(/\D/g, ""),
                val = this.value.replace(/\D/g, ""),
                new_value = matrix.replace(/[_\d]/g, function (a) {
                    return i < val.length ? val.charAt(i++) || def.charAt(i) : a
                });
            i = new_value.indexOf("_");
            if (i != -1) {
                i < 5 && (i = 3);
                new_value = new_value.slice(0, i)
            }
            var reg = matrix.substr(0, this.value.length).replace(/_+/g,
                function (a) {
                    return "\\d{1," + a.length + "}"
                }).replace(/[+()]/g, "\\$&");
            reg = new RegExp("^" + reg + "$");
            if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
            if (event.type == "blur" && this.value.length < 5) this.value = ""
        }
        input.addEventListener("input", mask, false);
        input.addEventListener("focus", mask, false);
        input.addEventListener("blur", mask, false);
        input.addEventListener("keydown", mask, false)
    });
});



// Плавный скролл
const anchors = [].slice.call(document.querySelectorAll('.scroll')),
    animationTime = 400,
    framesCount = 20;

function scroll(item) {
    let element = document.querySelector(item.getAttribute('href'))
    if (!element) return
    // для каждого якоря берем соответствующий ему элемент и определяем его координату Y
    let coordY = element.getBoundingClientRect().top + window.pageYOffset;

    // запускаем интервал, в котором
    let scroller = setInterval(function () {
        // считаем на сколько скроллить за 1 такт
        let scrollBy = coordY / framesCount;

        // если к-во пикселей для скролла за 1 такт больше расстояния до элемента
        // и дно страницы не достигнуто
        if (scrollBy > window.pageYOffset - coordY && window.innerHeight + window.pageYOffset < document.body.offsetHeight) {

            // то скроллим на к-во пикселей, которое соответствует одному такту
            window.scrollBy(0, scrollBy);
        } else {
            // иначе добираемся до элемента и выходим из интервала
            window.scrollTo(0, coordY);
            clearInterval(scroller);
        }
        // время интервала равняется частному от времени анимации и к-ва кадров
    }, animationTime / framesCount);

}

anchors.forEach(item => item.addEventListener('click', (e) => {
    e.preventDefault()
    scroll(item)
}))

function up() {
    var top = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
    if (top > 0) {
        window.scrollBy(0, ((top + 300) / -10));
        t = setTimeout('up()', 20);
    } else clearTimeout(t);
    return false;
}

// Popups
class Popup {
    constructor(popupElement) {
        this.popupElement = popupElement;
        this._closeButton = this.popupElement.querySelector('.popup__close');
        this._img = this.popupElement.querySelector('.popup__img') ?? ''
        this._video = this.popupElement.querySelector('.video') ?? ''
        this._videoClone = this._video ? this._video.innerHTML : ''
        this._handleEscClose = this._handleEscClose.bind(this)
        this._openingLinks = document.querySelectorAll(`[data-pointer="${this.popupElement.id}"]`)
        this.setEventListeners()
    }

    open(el) {
        document.body.style.overflow = "hidden";
        this.popupElement.classList.add('popup_opened')
        document.addEventListener('keydown', this._handleEscClose);
        if (this._img && el.src) this._img.src = el.src
        if (this._video) this._video.innerHTML = this._videoClone
    }

    close() {
        this.popupElement.classList.remove('popup_opened');
        document.body.style.overflow = "visible";
        document.removeEventListener('keydown', this._handleEscClose);
        if (this.popupElement.id === 'stories') stories.reset()
        if (this._video) this._video.innerHTML = ''
    }

    _handleEscClose(evt) {
        if (evt.keyCode === 27) {
            this.close();
        }
    }

    _handleOverlayClick(evt) {
        if (evt.target === evt.currentTarget) {
            this.close();
        }
    }

    setEventListeners() {
        this._openingLinks.forEach(link => link.addEventListener('click', (e) => { e.preventDefault(); this.open(e.target) }))
        this._closeButton.addEventListener('click', () => this.close());
        this.popupElement.addEventListener('click', this._handleOverlayClick.bind(this));
    }
}

const popups = document.querySelectorAll('.popup')
let arrPopups = {}
document.addEventListener('DOMContentLoaded', () => {
    if (popups.length > 0) popups.forEach(item => {
        const popup = new Popup(item)
        arrPopups[item.id] = popup
    })
})
