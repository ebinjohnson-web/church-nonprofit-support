/* Web3Forms handles delivery; inquiry fields are never saved in browser storage. */
(() => {
  const form = document.getElementById('inquiry-form');
  if (!form) return;
  const fields = document.getElementById('contact-fields');
  const button = document.getElementById('send-inquiry');
  const status = document.getElementById('inquiry-status');
  const service = document.getElementById('inquiry-service');
  const subjects = {general:'Website Inquiry',website:'Website Design or Refresh Inquiry','website-support':'Website & Content Support Inquiry','digital-support':'Digital Operations Support Inquiry'};
  const requested = new URLSearchParams(location.search).get('service');
  if (Object.hasOwn(subjects, requested)) service.value = requested;
  let sending = false;
  function showStatus(message, state) {
    status.textContent = message;
    status.dataset.state = state;
  }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending || !form.reportValidity()) return;
    const payload = Object.fromEntries(new FormData(form));
    if (!payload['h-captcha-response']) {
      showStatus('Please complete the spam check. If it does not load, email ebin@ebinjohnson.ca instead.', 'error');
      return;
    }
    payload.subject = subjects[service.value] || subjects.general;
    payload.service = service.options[service.selectedIndex].text;
    sending = true;
    fields.disabled = true;
    button.textContent = 'Sending…';
    form.setAttribute('aria-busy', 'true');
    showStatus('Sending your message…', 'pending');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    try {
      const response = await fetch(form.action, {
        method:'POST',
        headers:{'Content-Type':'application/json',Accept:'application/json'},
        body:JSON.stringify(payload),
        signal:controller.signal
      });
      const result = await response.json();
      if (!response.ok || result.success !== true) throw new Error('Submission was not accepted');
      form.reset();
      if (Object.hasOwn(subjects, requested)) service.value = requested;
      showStatus('Thank you — your message has been sent. I’ll reply to the email address you provided.', 'success');
    } catch (error) {
      showStatus(error.name === 'AbortError'
        ? 'Sending took too long, so I could not confirm delivery. Your message is still here. You can try again or email ebin@ebinjohnson.ca.'
        : 'Your message could not be confirmed as sent. Your details are still here. Please try again or email ebin@ebinjohnson.ca.', 'error');
    } finally {
      clearTimeout(timeout);
      fields.disabled = false;
      sending = false;
      button.textContent = 'Send message';
      form.setAttribute('aria-busy', 'false');
      // A challenge token is single-use, including rejected or interrupted requests.
      if (window.hcaptcha) window.hcaptcha.reset();
    }
  });
})();
