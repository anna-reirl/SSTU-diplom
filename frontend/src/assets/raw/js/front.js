function activate_theme_scripts(){

setTimeout(function () {

    // ------------------------------------------------------- //
    // Tooltips init
    // ------------------------------------------------------ //
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });



    // ------------------------------------------------------- //
    // Sidebar Functionality
    // ------------------------------------------------------ //
    const sbToggleBtn = document.getElementById('toggle-btn'),
          sideNavbar  = document.querySelector('.side-navbar'),
          innerContent = document.querySelector('.content-inner'),
          smBrand = document.querySelector('.navbar-header .brand-small'),
          lgBrand = document.querySelector('.navbar-header .brand-big');

    // if (sideNavbar) {
        sbToggleBtn.addEventListener('click', function (e) {
            e.preventDefault();
            this.classList.toggle('active');

            sideNavbar?.classList.toggle('shrinked');
            innerContent?.classList.toggle('active');
            document.dispatchEvent(new Event('sidebarChanged'));

            /* THIS IS NOT THERE ANY MORE [UTILITY CLASSES USED] */

            // if (window.outerWidth > 1183) {
            //     if (sbToggleBtn.classList.contains('active')) {
            //         smBrand.style.display = 'none';
            //         lgBrand.style.display = 'block';
            //     } else {
            //         smBrand.style.display = 'block';
            //         lgBrand.style.display = 'none';
            //     }
            // }
            //
            // if (window.outerWidth < 1183) {
            //     smBrand.style.display = 'block';
            // }
        });
    // }




    // ------------------------------------------------------- //
    // Footer
    // ------------------------------------------------------ //
    let footer = document.querySelector('#footer');
    if (footer) {
        document.addEventListener('sidebarChanged', function () {
            adjustFooter();
        });
        window.addEventListener('resize', function () {
            adjustFooter();
        });
    }

    function adjustFooter() {
        var footerBlockHeight = document.querySelector('#footer').outerHeight;
        innerContent.style.paddingBottom = `${footerBlockHeight}px`;
    }



    // ------------------------------------------------------- //
    // External links to new window
    // ------------------------------------------------------ //
    document.querySelectorAll('.external').forEach((el) => {
        el.addEventListener('click', function (e) {
            e.preventDefault();
            window.open(el.getAttribute('href'));
        });
    });



    // ------------------------------------------------------- //
    // Profile page choices
    // ------------------------------------------------------ //
    function injectClassess(x) {
        let pickerCustomClass = x.dataset.customclass;
        let pickerSevClasses = pickerCustomClass.split(' ');
        x.parentElement.classList.add.apply(x.parentElement.classList, pickerSevClasses);
    }

    const profileCountryChoices = document.querySelector('.profile-country-choices');
    if (profileCountryChoices) {
        const countryChoices = new Choices(profileCountryChoices, {
            searchEnabled: false,
            placeholder: false,
            callbackOnInit: () => injectClassess(profileCountryChoices)
        });
    }


}, 0);


}

export { activate_theme_scripts };