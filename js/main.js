document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  const headerInner = document.querySelector('.header-inner');

  // Create overlay dynamically inside header, after nav
  const overlay = document.createElement('div');
  overlay.classList.add('menu-overlay');
  headerInner.insertBefore(overlay, headerInner.querySelector('.actions'));

  function openMenu() {
    nav.classList.add('open');
    overlay.classList.add('visible');
    document.body.classList.add('menu-open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    nav.classList.remove('open');
    overlay.classList.remove('visible');
    document.body.classList.remove('menu-open');
    document.body.style.overflow = '';
  }

  menuToggle.addEventListener('click', () => {
    if (nav.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Only close when clicking overlay
  overlay.addEventListener('click', closeMenu);

  // Close when clicking nav links
  document.querySelectorAll('.main-nav a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });


  let touchStartX = 0;
let touchEndX = 0;
const swipeThreshold = 50; // minimum distance in px to trigger swipe

nav.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
});

nav.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  const deltaX = touchEndX - touchStartX;
  // swipe left to close
  if (deltaX < -swipeThreshold) {
    closeMenu();
  }
}

  //////////////////////////////////////////////////

  // Close drawer when clicking a nav link
  document.querySelectorAll('.main-nav a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open'); document.body.classList.remove('menu-open');
    });
  });

  // ----- Simple filter active state -----
  document.querySelectorAll('.filter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter').forEach(b =>
        b.classList.remove('active'));
        btn.classList.add('active');
    });
  });

  // ----- Reveal on scroll -----
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.transitionDelay = '0ms';
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px 0px 0px' });
    
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }
  
  // ----- Hero initial reveal -----
  const hero = document.querySelector('.hero');
  if (hero) {
    setTimeout(() => {
      hero.classList.add('visible');
      hero.querySelectorAll('.reveal').forEach(r =>
        r.classList.add('visible'));
    }, 120);
  }
});



const filters = document.querySelectorAll('.filter');
const projects = document.querySelectorAll('.project-card');
const cards = document.querySelectorAll('.who-we-help .card');

filters.forEach(button => {
  button.addEventListener('click', () => {
    // Remove 'active' from all buttons
    filters.forEach(btn => btn.classList.remove('active'));
    // Add 'active' to clicked button
    button.classList.add('active');

    const category = button.dataset.category;

    projects.forEach(project => {
      if(category === 'all category' || project.dataset.category === category) {
        project.style.display = 'block';
      } else {
        project.style.display = 'none';
      }
    });
  });
});

// Add click listeners to cards to trigger project filter
cards.forEach(card => {
  card.addEventListener('click', (e) => {
    e.preventDefault();
    const filter = card.dataset.filter;

    // Trigger the corresponding filter button
    const btn = document.querySelector(`.filter[data-category="${filter}"]`);
    if(btn) btn.click();

    // Smooth scroll to projects section
    document.querySelector('#projects').scrollIntoView({ behavior: 'smooth' });
  });
});



document.querySelector('.contact-form').addEventListener('submit', function(e) {
  e.preventDefault(); // prevent normal form submission

  const name = document.getElementById('name').value.trim();
  const message = document.getElementById('message').value.trim();
  const referral = document.getElementById('referral').value;
  const consult = document.getElementById('consult').checked ? 'Yes' : 'No';

  console.log({name, message, referral, consult});
  if (!name || !message || !referral) {
    return;
  }

  const subject = encodeURIComponent(`Quote Request from ${name}`);
  const body = encodeURIComponent(
    `${message}\n\n` +
    "------------------------\n\n" +
    `How did you find us: ${referral}\n\n` +
    `Consultation request: ${consult}`
  );

  const mailtoLink = `mailto:contact.appanid@gmail.com?subject=${subject}&body=${body}`;

  window.open(mailtoLink);
});


const textarea = document.getElementById('message');

textarea.addEventListener('input', autoResize);

function autoResize() {
  this.style.height = 'auto'; // reset height
  this.style.height = this.scrollHeight + 'px'; // set to scroll height
}


const form = document.querySelector('.contact-form');
const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
const errorMsg = document.getElementById('form-error');

inputs.forEach(input => {
  input.addEventListener('blur', () => {
    if (!input.value.trim()) {
      input.classList.add('error');
      errorMsg.style.display = 'block';
    } else {
      input.classList.remove('error');
      if ([...inputs].every(i => i.value.trim())) {
        errorMsg.style.display = 'none';
      }
    }
  });
});

form.addEventListener('submit', e => {
  let valid = true;
  inputs.forEach(input => {
    if (!input.value.trim()) {
      input.classList.add('error');
      valid = false;
    }
  });
  if (!valid) {
    e.preventDefault();
    errorMsg.style.display = 'block';
  }
});



// Trust section accordion - accessible toggle
document.querySelectorAll('.accordion-header').forEach(button => {
  button.addEventListener('click', () => {
    const item = button.parentElement;
    const expanded = button.getAttribute('aria-expanded') === 'true';

    // toggle this item
    item.classList.toggle('active', !expanded);
    button.setAttribute('aria-expanded', String(!expanded));

    // If you'd like only one open at a time, uncomment the lines below:
    document.querySelectorAll('.accordion-item').forEach(other => {
      if (other !== item) {
        other.classList.remove('active');
        const btn = other.querySelector('.accordion-header');
        if (btn) btn.setAttribute('aria-expanded','false');
      }
    });
  });

  // keyboard support: Enter or Space to toggle
  button.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      button.click();
    }
  });
});

/* Projects/Portfolio */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', () => {
    const project = card.getAttribute('data-project');
    const modal = document.getElementById(`project-modal-${project}`);
    if (modal) modal.classList.add('active');
  });
});

document.querySelectorAll('.modal-close').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.project-modal').classList.remove('active');
  });
});

window.addEventListener('click', e => {
  if (e.target.classList.contains('project-modal')) {
    e.target.classList.remove('active');
  }
});