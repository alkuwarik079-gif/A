/**
 * Opening curtain shown once per visit: the name writes itself in on maroon, then the
 * curtain closes into a circle to reveal the site. Pure CSS, so it finishes even if
 * scripts are slow; an inline script in <head> skips it after the first page of a visit.
 */
export default function IntroSplash() {
  return (
    <div className="intro-splash" aria-hidden>
      <div className="intro-inner">
        <p className="intro-ar font-display">عربي١٠٠</p>
        <p className="intro-en font-display" dir="ltr">
          Arabic 100
        </p>
        <span className="intro-line" />
      </div>
    </div>
  );
}

export const introSkipScript = `try{if(sessionStorage.getItem('a100-intro'))document.documentElement.classList.add('no-intro');else sessionStorage.setItem('a100-intro','1')}catch(e){}`;
