// Lazyload
const lazyImages = document.querySelectorAll('img[data-src], [data-srcset]')
if (lazyImages.length > 0) {
    lazyImages.forEach(img => {
        function showImg() {
            const { top } = img.getBoundingClientRect()
            if (top < window.innerHeight) {
                if (img.dataset.src) img.setAttribute('src', img.dataset.src)
                if (img.dataset.srcset) img.style.backgroundImage = `url(${img.dataset.srcset})`
                img.removeAttribute('data-src')
                img.removeAttribute('data-srcset')
                document.removeEventListener('scroll', showImg)
            }
        }
        showImg()
        document.addEventListener('scroll', showImg)
    })
}


function setSameHeight(selector, elementsNode, noRepeatListener) {
    let column = 0
    const elements = selector ? document.querySelectorAll(selector) : elementsNode
    if (!elements.length) return
    elements.forEach(el => el.offsetHeight > column ? column = el.offsetHeight : '')
    elements.forEach(el => el.style.height = column + 'px')

    if (noRepeatListener) return

    window.addEventListener('resize', () => {
        elements.forEach(el => el.style.height = '')
        setSameHeight(selector, elementsNode, true)
    }, true)
}

const btnUp = {
    el: document.querySelector('.btn-up'),
    show() {
        // удалим у кнопки класс btn-up_hide
        this.el.classList.remove('btn-up_hide');
    },
    hide() {
        // добавим к кнопке класс btn-up_hide
        this.el.classList.add('btn-up_hide');
    },
    addEventListener() {
        if (!this.el) return
        // при прокрутке содержимого страницы
        window.addEventListener('scroll', () => {
            // определяем величину прокрутки
            const scrollY = window.scrollY || document.documentElement.scrollTop;
            // если страница прокручена больше чем на 400px, то делаем кнопку видимой, иначе скрываем
            scrollY > 400 ? this.show() : this.hide();
        });
        // при нажатии на кнопку .btn-up
        document.querySelector('.btn-up').onclick = () => {
            // переместим в начало страницы
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });
        }
    }
}

btnUp.addEventListener();


//Спойлеры
const spoilers = document.querySelectorAll('.spoiler')
if (spoilers.length > 0) {
    spoilers.forEach(spoiler => {
        const top = spoiler.querySelector('.spoiler-top')
        top.addEventListener('click', () => spoiler.classList.toggle('spoiler-open'))
    })
}

const anchors = [].slice.call(document.querySelectorAll('.scroll')),
    animationTime = 400,
    framesCount = 20;

function scroll(item) {
    let element = document.querySelector(item.getAttribute('href'))
    if (!element) return
    header.classList.remove('menu-open')
    let coordY = element.getBoundingClientRect().top + window.pageYOffset;
    let scroller = setInterval(function () {
        let scrollBy = coordY / framesCount;
        if (scrollBy > window.pageYOffset - coordY && window.innerHeight + window.pageYOffset < document.body.offsetHeight) {
            window.scrollBy(0, scrollBy);
        } else {
            window.scrollTo(0, coordY);
            clearInterval(scroller);
        }
    }, animationTime / framesCount);
}

anchors.forEach(item => item.addEventListener('click', (e) => {
    e.preventDefault()
    scroll(item)
}))

// Popups
class Popup {
    constructor(popupElement) {
        this.popupElement = popupElement;
        this._closeButton = this.popupElement.querySelector('.popup__close');
        this._img = this.popupElement.querySelector('.popup__img') ?? ''
        this._handleEscClose = this._handleEscClose.bind(this)
        this._openingLinks = document.querySelectorAll(`[data-pointer="${this.popupElement.id}"]`)
        this.form = this.popupElement.querySelector('form')
        this.setEventListeners()
    }

    open(el) {
        document.body.style.overflow = "hidden";
        this.popupElement.classList.add('popup_opened')
        document.addEventListener('keydown', this._handleEscClose);
        const src = el.getAttribute('data-src-photo')
        console.log(el)
        if (this._img && src) this._img.src = src
    }

    close() {
        this.popupElement.classList.remove('popup_opened');
        document.body.style.overflow = "visible";
        document.removeEventListener('keydown', this._handleEscClose);
        if (this.form && this.form.classList.contains('form_success')) {
            setTimeout(() => {
                const valids = this.form.querySelectorAll('.valid')
                if (valids.length) valids.forEach(v => v.classList.remove('valid'))
                this.form.classList.remove('form_success')
            }, 300)
        }
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
        this._openingLinks.forEach(link => link.addEventListener('click', (e) => { e.preventDefault(); this.open(e.currentTarget) }))
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

//Маска
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


const swiperRooms = new Swiper('.swiper.rooms', {
    slidesPerView: 4,
    spaceBetween: 10,
    navigation: {
        nextEl: '.swiper.rooms .swiper-button-next',
        prevEl: '.swiper.rooms .swiper-button-prev',
    },
    scrollbar: {
        el: '.swiper.rooms .swiper-scrollbar',
        draggable: true,
    },
});

const swiperStocks = new Swiper('.swiper.stocks', {
    slidesPerView: 3,
    spaceBetween: 10,
    navigation: {
        nextEl: '.swiper.stocks .swiper-button-next',
        prevEl: '.swiper.stocks .swiper-button-prev',
    },
    scrollbar: {
        el: '.swiper.stocks .swiper-scrollbar',
        draggable: true,
    },
});