var CONFIG = require('./config'),
    tmp = require('./ui/tmp'),
    el = require('./ui/elements'),
    changeTitle = require('./ui/changeTitle'),
    isFallbackNeeded = require('./utils/isFallbackNeeded');

function tick(worker, settings) {
  tmp.now = Date.now();

  // перевод
  if ((tmp.now - tmp.longTextTime) > tmp.longTextDelay && tmp.longTextTime !== 0) {
    tmp.longTextTime = 0;

    changeTitle(isFallbackNeeded);

    localStorage.setItem('lastText', el.input.value);

    worker.postMessage({ text: el.input.value, settings: settings } );
  }

  // заголовок
  if (tmp.isMouseOnTitleArrow) {
    changeTitle(isFallbackNeeded);
  }

  // подзаголовок
  if ((tmp.now - tmp.copiedTime) > CONFIG.SUBTITLE_COPIED_TEXT_DELAY && tmp.copiedTime !== 0) {
    tmp.copiedTime = 0;

    el.subtitle.textContent = CONFIG.SUBTITLE_DEFAULT_TEXT;
  }

  requestAnimationFrame(tick.bind(this, worker, settings));
}


module.exports = tick;