 // Dark/light mode toggle logic with localStorage
  const toggleBtn = document.querySelector('.toggle-theme');
  const body = document.body;

  function updateToggleIcon(isDark) {
    toggleBtn.textContent = isDark ? '🌙' : '☀️';
    toggleBtn.setAttribute('aria-checked', isDark ? 'true' : 'false');
    toggleBtn.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
  }

  function setTheme(theme) {
    if(theme === 'dark') {
      body.setAttribute('data-theme', 'dark');
      updateToggleIcon(true);
    } else {
      body.setAttribute('data-theme', 'light');
      updateToggleIcon(false);
    }
    localStorage.setItem('theme', theme);
  }

  toggleBtn.addEventListener('click', () => {
    let currentTheme = body.getAttribute('data-theme');
    if(currentTheme === 'dark') setTheme('light');
    else setTheme('dark');
  });

  // Initialization
  (function() {
    const savedTheme = localStorage.getItem('theme');
    if(savedTheme) {
      setTheme(savedTheme);
    } else {
      // Default dark mode
      setTheme('dark');
    }
  })();

  // Smooth active nav link highlight on scroll
  const sections = document.querySelectorAll('main section');
  const navLinks = document.querySelectorAll('nav a');

  function onScroll() {
    const scrollPos = window.scrollY + window.innerHeight / 2;
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const top = window.scrollY + rect.top;
      const bottom = top + section.offsetHeight;
      if(scrollPos >= top && scrollPos < bottom){
        navLinks.forEach(link => {
          link.classList.remove('active');
          if(link.getAttribute('href').substring(1) === section.id) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  window.addEventListener('scroll', onScroll);

  // Animated floating dots background on canvas
  const canvas = document.getElementById('bgCanvas');
  const ctx = canvas.getContext('2d');
  let dotsArray = [];
  const numDots = 60;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Dot {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 3 + 1;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = 0.2 + Math.random() * 0.4;
      this.color = 'rgba(0,255,247,' + this.opacity.toFixed(2) + ')';
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if(this.x > canvas.width) this.x = 0;
      else if(this.x < 0) this.x = canvas.width;
      if(this.y > canvas.height) this.y = 0;
      else if(this.y < 0) this.y = canvas.height;
    }
    draw() {
      ctx.beginPath();
      const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size*5);
      gradient.addColorStop(0, 'rgba(0,255,247,0.8)');
      gradient.addColorStop(0.8, 'rgba(0,255,247,0.2)');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initDots() {
    dotsArray = [];
    for(let i = 0; i < numDots; i++) {
      dotsArray.push(new Dot());
    }
  }

  function animateDots() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dotsArray.forEach(dot => {
      dot.update();
      dot.draw();
    });

    // Draw connecting lines if close
    for(let i = 0; i < dotsArray.length; i++) {
      for(let j = i+1; j < dotsArray.length; j++) {
        const dx = dotsArray[i].x - dotsArray[j].x;
        const dy = dotsArray[i].y - dotsArray[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if(dist < 120) {
          ctx.strokeStyle = 'rgba(0,255,247,' + (1 - dist/120) * 0.3 + ')';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(dotsArray[i].x, dotsArray[i].y);
          ctx.lineTo(dotsArray[j].x, dotsArray[j].y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animateDots);
  }
  initDots();
  animateDots();
