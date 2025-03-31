function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('open');
  }
  
  // Aktiver Menüpunkt hervorheben
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
  
  // Toast bei Speichern (optional: automatisch triggern)
  const form = document.querySelector('form');
  const toast = document.getElementById('toast');
  
  if (form && toast) {
    form.addEventListener('submit', () => {
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2500);
    });
  }
  