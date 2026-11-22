window.ym = function () {
  (window.ym.a = window.ym.a || []).push(arguments);
};
window.ym.l = Date.now();

const script = document.createElement('script');
script.async = true;
script.src = 'https://mc.yandex.ru/metrika/tag.js?id=105728096';
document.head.append(script);

window.ym(105728096, 'init', {
  ssr: true,
  webvisor: true,
  clickmap: true,
  accurateTrackBounce: true,
  trackLinks: true,
});
