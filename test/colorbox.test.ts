import { keepTrackApi } from '@app/keepTrackApi';
import { KeepTrack } from '@app/keeptrack';
import { getEl } from '@app/lib/get-el';
import { openColorbox } from './../src/lib/colorbox';
import * as getElAll from './../src/lib/get-el';
// Generated by CodiumAI

/*
Code Analysis

Objective:
The openColorbox function is used to display a colorbox with either an image or an iframe, depending on the options passed in. It also includes a loading screen and a callback function that can be triggered when the colorbox is closed.

Inputs:
- url: a string representing the URL of the image or iframe to be displayed in the colorbox
- options: an optional object with the following properties:
  - image: a boolean indicating whether the content to be displayed is an image or an iframe (default is false, meaning an iframe will be displayed)
  - callback: an optional function to be called when the colorbox is closed

Flow:
1. Check if the colorbox element exists, and create it if it doesn't.
2. Add a click event listener to the colorbox element that will close the colorbox and trigger the callback function (if provided).
3. Show a loading screen for 2 seconds.
4. Set the display style of the colorbox element to "block".
5. Depending on the value of the "image" option, set up the colorbox to display either an image or an iframe.
6. Slide the colorbox in from the right.
7. When the slide animation is complete, do nothing (no callback function is provided).

Outputs:
- None (void function)

Additional aspects:
- The function uses other helper functions defined in the same module, such as getEl, slideInRight, slideOutLeft, and showLoading.
- The colorbox is created as a div element with a unique ID, and appended to the body of the document.
- The colorbox can be closed by calling the closeColorbox function, which slides it out to the left and sets its display style to "none".
*/

describe('openColorbox_function', () => {
  beforeEach(() => {
    KeepTrack.getDefaultBodyHtml();
    keepTrackApi.containerRoot.innerHTML = `
        <div id="colorbox-container" style="display:none;"></div>
        <div id="colorbox-div" style="display:block;"></div>
        <div id="colorbox-iframe" style="display:none;"></div>
        <div id="colorbox-img" style="display:none;"></div>
        <div id="loading-screen" style="display:none;"></div>
        `;
  });

  // Tests that a colorbox is created if it does not exist
  it('test_create_colorbox', () => {
    getEl('colorbox-div').remove();
    const colorboxDiv = getEl('colorbox-div', true);
    expect(colorboxDiv).toBeNull();

    // jest replace getEl function
    jest.spyOn(getElAll, 'getEl').mockImplementationOnce(() => <HTMLElement>getEl('colorbox-div'));

    openColorbox('https://www.example.com');
    const newColorboxDiv = getEl('colorbox-div');
    expect(newColorboxDiv).not.toBeNull();
  });

  // Tests that loading screen is shown before opening the colorbox
  it('test_show_loading', () => {
    const loading = <HTMLElement>getEl('loading-screen');
    expect(loading.style.display).toBe('none');
    openColorbox('https://www.example.com');
    expect(loading.style.display).toBe('flex');
  });

  // Tests that colorbox is displayed after loading screen disappears
  it('test_display_colorbox', () => {
    let colorboxDiv = <HTMLElement>getEl('colorbox-div');
    openColorbox('https://www.example.com');
    jest.advanceTimersByTime(2000);
    colorboxDiv = <HTMLElement>getEl('colorbox-div');
    expect(colorboxDiv.style.display).toBe('block');
  });

  // Tests that image colorbox is set up if options.image is true
  it('test_setup_image_colorbox', () => {
    // jest replace getEl function
    jest.spyOn(getElAll, 'getEl').mockImplementationOnce(() => <HTMLElement>getEl('colorbox-div'));

    openColorbox('https://www.example.com', { image: true });
    jest.advanceTimersByTime(2000);

    const colorboxContainer = <HTMLElement>getEl('colorbox-container');
    expect(colorboxContainer.style.transform).toBe('translateX(-100%)');
    const colorboxIframe = <HTMLElement>getEl('colorbox-iframe');
    expect(colorboxIframe.style.display).toBe('none');
    const colorboxImg = <HTMLImageElement>getEl('colorbox-img');
    expect(colorboxImg.style.display).toBe('block');
    expect(colorboxImg.src).toBe('https://www.example.com');
  });

  // Tests that iframe colorbox is set up if options.image is false
  it('test_setup_iframe_colorbox', () => {
    // jest replace getEl function
    jest.spyOn(getElAll, 'getEl').mockImplementationOnce(() => <HTMLElement>getEl('colorbox-div'));

    openColorbox('https://www.example.com', { image: false });
    jest.advanceTimersByTime(2000);

    const colorboxContainer = <HTMLElement>getEl('colorbox-container');
    expect(colorboxContainer.style.width).toBe('100%');
    const colorboxIframe = <HTMLIFrameElement>getEl('colorbox-iframe');
    expect(colorboxIframe.style.display).toBe('block');
    expect(colorboxIframe.src).toBe('https://www.example.com');
    const colorboxImg = <HTMLElement>getEl('colorbox-img');
    expect(colorboxImg.style.display).toBe('none');
  });

  // Tests that colorbox is closed when clicked
  it('test_close_colorbox', () => {
    openColorbox('https://www.example.com');
    jest.advanceTimersByTime(2000);

    const colorboxDom = <HTMLElement>getEl('colorbox-div');
    expect(colorboxDom.style.display).toBe('block');
    colorboxDom.click();
    jest.advanceTimersByTime(1000);
    expect(colorboxDom.style.display).toBe('none');
  });
});
