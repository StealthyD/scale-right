(function(){var d=document.documentElement,b=document.getElementById('themeToggle'),mq=matchMedia('(prefers-color-scheme: dark)');
function cur(){return d.getAttribute('data-theme')||(mq.matches?'dark':'light')}
function sync(){var m=cur();d.setAttribute('data-mode',m);b.setAttribute('aria-label',m==='dark'?'Switch to light mode':'Switch to dark mode');b.setAttribute('aria-pressed',m==='dark')}
b.addEventListener('click',function(){var n=cur()==='dark'?'light':'dark';d.setAttribute('data-theme',n);try{localStorage.setItem('theme',n)}catch(e){}sync()});
mq.addEventListener&&mq.addEventListener('change',sync);sync()})();
