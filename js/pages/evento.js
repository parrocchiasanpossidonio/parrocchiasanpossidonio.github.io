document.addEventListener('DOMContentLoaded', async () => {
  document.querySelectorAll('.share-button').forEach(button => {
    button.addEventListener('click', async () => {

      if (navigator.share) {
        try {
            await navigator.share({
            title: document.title,
            text: 'Dai un\'occhiata a questo evento!',
            url: window.location.href
            });
          console.log('Condiviso con successo');
        } catch (error) {
          console.error('Errore durante la condivisione:', error);
        }
      } else {
        alert('La condivisione non è supportata su questo browser.');
      }
    });
  })
});