document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('bookingForm');

  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const formData = {
        pickup: document.getElementById('pickup').value.trim(),
        drop: document.getElementById('drop').value.trim(),
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        vehicle: document.getElementById('vehicle').value,
        name: document.getElementById('name').value.trim(),
        phone: document.getElementById('phone').value.trim(),
      };

      if (!formData.name || !formData.phone || !formData.pickup || !formData.drop) {
        alert('⚠️ Please fill in all required fields.');
        return;
      }

      try {
        const res = await fetch('api/server.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (res.ok) {
          alert('✅ Booking submitted successfully!');
          form.reset();
        } else {
          alert('❌ Failed to send booking: ' + (data.error || 'Unknown error'));
        }
      } catch (error) {
        console.error('⚠️ Network error:', error);
        alert('⚠️ Network error. Please try again later.');
      }
    });
  }
});
