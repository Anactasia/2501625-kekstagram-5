import { previewImage } from './form-handler.js';

const SCALE_MIN = 25;
const SCALE_MAX = 100;
const SCALE_STEP = 25;
const DEFAULT_SCALE = 100;

const EFFECTS = {
  none: { range: { min: 0, max: 1 }, start: 1, step: 0.1, unit: '', filter: '', hideSlider: true },
  chrome: { range: { min: 0, max: 1 }, start: 1, step: 0.1, unit: '', filter: 'grayscale', hideSlider: false },
  sepia: { range: { min: 0, max: 1 }, start: 1, step: 0.1, unit: '', filter: 'sepia', hideSlider: false },
  marvin: { range: { min: 0, max: 100 }, start: 100, step: 1, unit: '%', filter: 'invert', hideSlider: false },
  phobos: { range: { min: 0, max: 3 }, start: 3, step: 0.1, unit: 'px', filter: 'blur', hideSlider: false },
  heat: { range: { min: 1, max: 3 }, start: 3, step: 0.1, unit: '', filter: 'brightness', hideSlider: false },
};

const scaleControlSmaller = document.querySelector('.scale__control--smaller');
const scaleControlBigger = document.querySelector('.scale__control--bigger');
const scaleControlValue = document.querySelector('.scale__control--value');
const effectLevelSlider = document.querySelector('.effect-level__slider');
const effectLevelValue = document.querySelector('.effect-level__value');
const effectsRadioButtons = document.querySelectorAll('.effects__radio');
const effectLevelContainer = document.querySelector('.img-upload__effect-level');

const setScale = (value) => {
  scaleControlValue.value = `${value}%`;
  previewImage.style.transform = `scale(${value / 100})`;
};

const applyEffectToImage = (effect) => {
  const effectConfig = EFFECTS[effect];

  if (effectConfig.hideSlider) {
    effectLevelContainer.classList.add('hidden');
    previewImage.style.filter = '';
  } else {
    effectLevelContainer.classList.remove('hidden');
    effectLevelSlider.noUiSlider.updateOptions({
      range: effectConfig.range,
      start: effectConfig.start,
      step: effectConfig.step,
    });

    effectLevelSlider.noUiSlider.set(effectConfig.start);
    effectLevelValue.value = effectConfig.start;

    previewImage.style.filter = effectConfig.filter
      ? `${effectConfig.filter}(${effectConfig.start}${effectConfig.unit})`
      : '';
  }
};

if (!effectLevelSlider.noUiSlider) {
  noUiSlider.create(effectLevelSlider, {
    range: EFFECTS.none.range,
    start: EFFECTS.none.start,
    step: EFFECTS.none.step,
    connect: 'lower',
  });
}

const onEffectChange = (evt) => {
  const effect = evt.target.value;
  applyEffectToImage(effect);
};

const onEffectLevelUpdate = (_, handle, unencoded) => {
  const activeEffect = document.querySelector('.effects__radio:checked').value;
  const effectConfig = EFFECTS[activeEffect];
  const value = unencoded[handle];
  effectLevelValue.value = value;
  previewImage.style.filter = effectConfig.filter
    ? `${effectConfig.filter}(${value}${effectConfig.unit})`
    : '';
};

effectsRadioButtons.forEach((radio) => radio.addEventListener('change', onEffectChange));
effectLevelSlider.noUiSlider.on('update', onEffectLevelUpdate);

const updateScale = (direction) => {
  let currentScale = parseInt(scaleControlValue.value, 10);
  if ((direction === 'smaller' && currentScale > SCALE_MIN) || (direction === 'bigger' && currentScale < SCALE_MAX)) {
    currentScale += direction === 'smaller' ? -SCALE_STEP : SCALE_STEP;
    setScale(currentScale);
  }
};

scaleControlSmaller.addEventListener('click', () => updateScale('smaller'));
scaleControlBigger.addEventListener('click', () => updateScale('bigger'));

setScale(DEFAULT_SCALE);
