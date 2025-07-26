const themeFunction = () => {
    const menuItems = document.querySelectorAll('.menu-item');
    const messagesNotification = document.querySelector('#messages-notifications');
    // const messages = document.querySelector('.messages');
    // const message = messages.querySelectorAll('.message');
    // const messageSearch = document.querySelector('#message-search');
    const theme = document.querySelector('#theme');
    const themeModel = document.querySelector('.customize-theme');
    const fontSizes = document.querySelectorAll('.choose-size span');
    const root = document.querySelector(':root');
    const colorPalette = document.querySelectorAll('.choose-color span');
    const bg1 = document.querySelector('.bg-1');
    const bg2 = document.querySelector('.bg-2');
    const bg3 = document.querySelector('.bg-3');

    // Function to apply preferences
    const applyPreferences = (preferences) => {
        root.style.setProperty('--primary-color-hue', preferences.primaryColorHue);
        root.style.setProperty('--light-color-lightness', preferences.lightColorLightness);
        root.style.setProperty('--white-color-lightness', preferences.whiteColorLightness);
        root.style.setProperty('--dark-color-lightness', preferences.darkColorLightness);
        document.querySelector('html').style.fontSize = preferences.fontSize;
    };

    // Function to save preferences
    const savePreferences = (preferences) => {
        localStorage.setItem('userPreferences', JSON.stringify(preferences));
    };

    // Function to load preferences
    const loadPreferences = () => {
        return JSON.parse(localStorage.getItem('userPreferences')) || {};
    };

    // Apply preferences on page load
    const userPreferences = loadPreferences();
    applyPreferences(userPreferences);

    // Function to change active menu item
    const changeActiveItem = () => {
        menuItems.forEach(item => {
            item.classList.remove('active');
        });
    };

    // Event listener for menu item click
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            changeActiveItem();
            item.classList.add('active');
            if (item.id !== 'notifications') {
                document.querySelector('.notifications-popup').style.display = 'none';
            } else {
                document.querySelector('.notifications-popup').style.display = 'block';
                document.querySelector('#notifications .notification-count').style.display = 'none';
            }
        });
    });

    // Event listener for messages notification click
    messagesNotification.addEventListener('click', () => {
        messages.style.boxShadow = '0 0 1rem var(--color-primary)';
        messagesNotification.querySelector('.notification-count').style.display = 'none';
        setTimeout(() => {
            messages.style.boxShadow = 'none';
        }, 2000);
    });


    // Function to open theme model
    const openThemeModel = () => {
        themeModel.style.display = 'grid';
    };

    // Function to close theme model
    const closeThemeModel = (e) => {
        if (e.target.classList.contains('customize-theme')) {
            themeModel.style.display = 'none';
        }
    };

    // Event listener for theme model click
    themeModel.addEventListener('click', closeThemeModel);

    // Event listener for theme click
    theme.addEventListener('click', openThemeModel);

    // Function to remove size selector
    const removeSizeSelector = () => {
        fontSizes.forEach(size => {
            size.classList.remove('active');
        });
    };

    // Event listener for font size selection
    fontSizes.forEach(size => {
        size.addEventListener('click', () => {
            removeSizeSelector();
            let fontsize;
            size.classList.toggle('active');
            if (size.classList.contains('font-size-1')) {
                fontsize = '10px';
                root.style.setProperty('----sticky-top-left', '5.4rem');
                root.style.setProperty('----sticky-top-right', '5.4rem');
            } else if (size.classList.contains('font-size-2')) {
                fontsize = '13px';
                root.style.setProperty('----sticky-top-left', '5.4rem');
                root.style.setProperty('----sticky-top-right', '-7rem');
            } else if (size.classList.contains('font-size-3')) {
                fontsize = '16px';
                root.style.setProperty('----sticky-top-left', '-2rem');
                root.style.setProperty('----sticky-top-right', '-17rem');
            } else if (size.classList.contains('font-size-4')) {
                fontsize = '19px';
                root.style.setProperty('----sticky-top-left', '-5rem');
                root.style.setProperty('----sticky-top-right', '-25rem');
            } else if (size.classList.contains('font-size-5')) {
                fontsize = '22px';
                root.style.setProperty('----sticky-top-left', '-12rem');
                root.style.setProperty('----sticky-top-right', '-35rem');
            }
            document.querySelector('html').style.fontSize = fontsize;

            // Update preferences
            userPreferences.fontSize = fontsize;
            savePreferences(userPreferences);
        });
    });

    // Function to change active color
    const changeActiveColor = () => {
        colorPalette.forEach(color => {
            color.classList.remove('active');
        });
    };

    // Event listener for color selection
    colorPalette.forEach(color => {
        color.addEventListener('click', () => {
            changeActiveColor();
            let primaryhue;
            if (color.classList.contains('color-1')) {
                primaryhue = 252;
            } else if (color.classList.contains('color-2')) {
                primaryhue = 52;
            } else if (color.classList.contains('color-3')) {
                primaryhue = 352;
            } else if (color.classList.contains('color-4')) {
                primaryhue = 152;
            } else if (color.classList.contains('color-5')) {
                primaryhue = 202;
            }
            color.classList.add('active');
            root.style.setProperty('--primary-color-hue', primaryhue);

            // Update preferences
            userPreferences.primaryColorHue = primaryhue;
            savePreferences(userPreferences);
        });
    });

    // Function to change background
    const changeBG = (lightcolor, whitecolor, darkcolor) => {
        root.style.setProperty('--light-color-lightness', lightcolor);
        root.style.setProperty('--white-color-lightness', whitecolor);
        root.style.setProperty('--dark-color-lightness', darkcolor);

        // Update preferences
        userPreferences.lightColorLightness = lightcolor;
        userPreferences.whiteColorLightness = whitecolor;
        userPreferences.darkColorLightness = darkcolor;
        savePreferences(userPreferences);
    };

    // Event listener for background 1 click
    bg1.addEventListener('click', () => {
        bg1.classList.add('active');
        bg3.classList.remove('active');
        bg2.classList.remove('active');
        changeBG('100%', '100%', '85%');
    });

    // Event listener for background 2 click
    bg2.addEventListener('click', () => {
        bg2.classList.add('active');
        bg1.classList.remove('active');
        bg3.classList.remove('active');
        changeBG('15%', '20%', '95%');
    });

    // Event listener for background 3 click
    bg3.addEventListener('click', () => {
        bg3.classList.add('active');
        bg1.classList.remove('active');
        bg2.classList.remove('active');
        changeBG('0%', '10%', '95%');
    });
};

export default themeFunction;
