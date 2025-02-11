export default function windowSizeCalc() {
    const headerHeight = document.querySelector('header').offsetHeight;
    const footerHeight = document.querySelector('footer').offsetHeight;
    const viewportHeight = window.innerHeight;

    const windowSizeCalc = viewportHeight - (headerHeight + footerHeight);

    return windowSizeCalc;
}