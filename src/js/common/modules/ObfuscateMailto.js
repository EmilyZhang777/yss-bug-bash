export class ObfuscateMailto {
  static run(scope) {
    const mailtoEls = document.querySelectorAll(
      `${scope ? `${scope} ` : ''}[data-adr-val]`,
    );
    mailtoEls.forEach((mailtoEl) => {
      mailtoEl.addEventListener('click', () => {
        const front = 'mai';
        const back = 'lto:';
        const adrVal = window.atob(mailtoEl.dataset.adrVal);
        window.location.href = `${front}${back}${adrVal}`;
      });
    });
  }
}
