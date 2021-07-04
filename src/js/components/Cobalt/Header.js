import { AccessibilityHelpers } from '@yext/components-util';
import createFocusTrap from 'focus-trap';

export class HeaderAce {
  constructor({
    mobileBP = 767,
    headerEl = document.getElementById('Header'),
    menuOverlayEl = headerEl.querySelector('.Header-overlay'),
    navEl = headerEl.querySelector('.Header-content'),
    menuEl = headerEl.querySelector('.Header-menu'),
    menuBtnEl = headerEl.querySelector('.Header-toggleIcon'),
    menuItems = headerEl.querySelectorAll('.Header-menuItem a'),
    mobileBPMatcher = window.matchMedia(`(max-width: ${mobileBP}px)`)
  } = {}) {
    this.headerEl = headerEl;
    this.menuOverlayEl = menuOverlayEl;
    this.navEl = navEl;
    this.menuEl = menuEl;
    this.menuBtnEl = menuBtnEl;
    this.menuItems = menuItems;
    this.mobileBPMatcher = mobileBPMatcher;

    this.accessibilityHelpersInstance = new AccessibilityHelpers();

    this.initFocusTrap();
    this.initListeners();
    this.initMobileHeader();
  }

  initFocusTrap() {
    this.focusTrap = createFocusTrap(this.headerEl, {
      initialFocus: this.menuBtnEl,
      onActivate: () => {
        this.handleHeaderTabIndexes(0);
      },
      onDeactivate: () => {
        this.handleHeaderTabIndexes(-1);
      },
    });
  }

  initListeners() {
    this.menuBtnEl.addEventListener('click', this.toggleMobileMenu.bind(this));
    this.menuOverlayEl.addEventListener('click', this.closeMobileMenu.bind(this, 0));
    document.addEventListener('keydown', e => {
      // Close header on Escape
      if (e.keyCode == 27 && this.headerEl.classList.contains('is-open')) {
        this.closeMobileMenu();
      }
    });
  }

  initMobileHeader() {
    this.handleMobileHeader();
    this.mobileBPMatcher.addListener(this.handleMobileHeader.bind(this));
  }

  closeMobileMenu(transitionTime = 300) {
    document.documentElement.classList.remove('u-header-open');

    this.navEl.style.height = '';
    this.headerEl.classList.remove('is-open');
    window.setTimeout(() => {
      this.menuOverlayEl.classList.remove('is-visible');
    }, transitionTime);

    this.focusTrap.deactivate();

    this.accessibilityHelpersInstance.setAriaProp(this.navEl, 'hidden', true);
    this.accessibilityHelpersInstance.setAriaProp(this.menuBtnEl, 'expanded', false);
    this.accessibilityHelpersInstance.setAriaProp(this.menuOverlayEl, 'expanded', false);
    this.accessibilityHelpersInstance.setAriaProp(this.menuOverlayEl, 'hidden', true);
  }

  enableMobileHeader() {
    this.handleHeaderTabIndexes(-1);
    this.accessibilityHelpersInstance.setAriaProp(this.navEl, 'hidden', true);
  }

  handleHeaderTabIndexes(tabIndex) {
    this.accessibilityHelpersInstance.setTabIndex(this.menuItems, tabIndex);
    this.accessibilityHelpersInstance.setTabIndex(this.menuOverlayEl, tabIndex);
  }

  handleMobileHeader() {
    if (this.mobileBPMatcher.matches) {
      this.enableMobileHeader();
    } else {
      this.resetMobileHeader();
    }
  }

  openMobileMenu() {
    document.documentElement.classList.add('u-header-open');

    this.menuOverlayEl.classList.add('is-visible');
    this.navEl.style.height = `${this.menuEl.offsetHeight}px`;
    this.headerEl.classList.add('is-open');

    this.focusTrap.activate();

    this.accessibilityHelpersInstance.setAriaProp(this.navEl, 'hidden', false);
    this.accessibilityHelpersInstance.setAriaProp(this.menuBtnEl, 'expanded', true);
    this.accessibilityHelpersInstance.setAriaProp(this.menuOverlayEl, 'expanded', true);
    this.accessibilityHelpersInstance.setAriaProp(this.menuOverlayEl, 'hidden', false);
  }

  resetMobileHeader() {
    this.closeMobileMenu(0);
    this.handleHeaderTabIndexes(0);
    this.accessibilityHelpersInstance.setAriaProp(this.navEl, 'hidden', false);
  }

  toggleMobileMenu() {
    if (this.headerEl.classList.contains('is-open')) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }
}
