import { AccessibilityHelpers } from '@yext/components-util';
const helpersInstance = new AccessibilityHelpers();
import { InputHelper } from '@yext/components-search-form';
import { FormValueScratchpad } from 'js/components/Cobalt/Locator/FormValueScratchpad.js';
import createFocusTrap from 'focus-trap';

export class FilterModal {
  constructor(filtersWrapper, triggerEl, searchForm) {
    if (!filtersWrapper) {
      return;
    }
    this.filtersWrapper = filtersWrapper;
    this.searchForm = searchForm;
    this.overlayEl = document.querySelector('.js-filters-overlay');
    this.inputs = Array.from(
      filtersWrapper.querySelectorAll('input,select')
    ).filter((el) => el.name);
    this.counterEls = document.querySelectorAll('.js-filters-count');

    if (triggerEl) {
      triggerEl.onclick = this.open.bind(this);
    }

    this.fvs = new FormValueScratchpad();
    this.fvs.registerInputs(this.inputs);

    this.filtersBound = false;
    this.bindFilters();
    this.updateFilterCount();
  }

  bindFilters() {
    if (this.filtersBound) {
      return;
    }
    this.filtersBound = true;

    for (const clearButton of this.filtersWrapper.querySelectorAll(
      '.js-filters-clear'
    )) {
      clearButton.addEventListener('click', this.clearAll.bind(this));
    }

    for (const toggleButton of document.querySelectorAll('.js-filters-open')) {
      toggleButton.onclick = this.open.bind(this);
    }

    for (const toggleButton of this.filtersWrapper.querySelectorAll(
      '.js-filters-close'
    )) {
      toggleButton.onclick = this.close.bind(this, true);
    }

    for (const toggleButton of this.filtersWrapper.querySelectorAll(
      '.js-filters-apply'
    )) {
      toggleButton.onclick = this.close.bind(this, false);
    }

    const focusTrapEl = this.filtersWrapper.querySelector('.js-filters-focus');
    if (focusTrapEl) {
      this.focusTrap = createFocusTrap(focusTrapEl);
    }

    for (const input of this.inputs) {
      input.addEventListener('change', this.updateApplyButtonState.bind(this));
    }

    focusTrapEl?.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.close(true);
      }
    });
  }

  updateApplyButtonState() {
    const appliers = this.filtersWrapper.querySelectorAll('.js-filters-apply');
    const disabled = this.fvs.changesAreCommitted();
    for (const toggleButton of appliers) {
      toggleButton.disabled = disabled;
    }
  }

  updateFilterCount() {
    const count = this.getActiveFiltersCount();
    for (const counter of this.counterEls) {
      counter.innerHTML = count;
      if (count > 0) {
        counter.style.display = '';
      } else {
        counter.style.display = 'none';
      }
    }
  }

  open() {
    this.fvs.commit();
    this.updateApplyButtonState();

    const header = document.querySelector('header');
    if (header) {
      header.classList.add('is-background');
    }

    document.body.classList.add('is-overflowHidden');
    this.filtersWrapper.classList.add('is-active');
    if (this.overlayEl) {
      this.overlayEl.classList.add('is-active');
    }

    if (this.focusTrap) {
      this.focusTrap.activate();
    }

    for (const controllingElement of this.filtersWrapper.querySelectorAll(
      'js-filters-apply,.js-filters-close,.js-filters-open'
    )) {
      helpersInstance.setAriaProp(controllingElement, 'expanded', true);
    }
  }

  close(restoreState) {
    if (restoreState) {
      this.fvs.reset();
    } else {
      this.fvs.commit();

      if (this.searchForm) {
        this.searchForm.submit();
      }
    }
    this.updateFilterCount();

    this.filtersWrapper.classList.remove('is-active');

    const header = document.querySelector('header');
    if (header) {
      header.classList.remove('is-background');
    }

    document.body.classList.remove('is-overflowHidden');

    if (this.overlayEl) {
      this.overlayEl.classList.remove('is-active');
    }

    if (this.focusTrap) {
      this.focusTrap.deactivate();
    }

    for (const controllingElement of this.filtersWrapper.querySelectorAll(
      'js-filters-apply,.js-filters-close,.js-filters-open'
    )) {
      helpersInstance.setAriaProp(controllingElement, 'expanded', false);
    }
  }

  getActiveFiltersCount() {
    return this.inputs.reduce(
      (filterCount, input) =>
        InputHelper.isEmpty(input) ? filterCount : filterCount + 1,
      0
    );
  }

  clearAll() {
    for (const input of this.inputs) {
      InputHelper.reset(input);
    }

    this.updateApplyButtonState();
  }
}
