document.addEventListener('DOMContentLoaded', async () => {
    const statusElement = document.getElementById('status');
    const shareButton = document.getElementById('shareButton');
    const receivedContactElement = document.getElementById('receivedContact');
    const receivedContactDataElement = document.getElementById('receivedContactData');
    
    // Initialize the NFC Contact Sharing
    const nfcContactSharing = new NFCContactSharing();
    
    try {
        const initialized = await nfcContactSharing.initialize();
        
        if (initialized) {
            statusElement.textContent = 'Status: NFC Ready. You can share contacts now.';
            statusElement.style.backgroundColor = '#dff0d8';
            shareButton.disabled = false;
        } else {
            statusElement.textContent = 'Status: NFC is not available on this device.';
            statusElement.style.backgroundColor = '#f2dede';
        }
    } catch (error) {
        statusElement.textContent = `Status: Error initializing NFC: ${error.message}`;
        statusElement.style.backgroundColor = '#f2dede';
    }
    
    // Set up the contact sharing functionality
    shareButton.addEventListener('click', async () => {
        const contact = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            name: `${document.getElementById('firstName').value} ${document.getElementById('lastName').value}`,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            organization: document.getElementById('organization').value,
            title: document.getElementById('title').value
        };
        
        statusElement.textContent = 'Status: Approach an NFC-enabled device to share the contact...';
        statusElement.style.backgroundColor = '#fcf8e3';
        
        try {
            const success = await nfcContactSharing.shareContact(contact);
            if (success) {
                statusElement.textContent = 'Status: Contact shared successfully!';
                statusElement.style.backgroundColor = '#dff0d8';
            } else {
                statusElement.textContent = 'Status: Failed to share contact. Try again.';
                statusElement.style.backgroundColor = '#f2dede';
            }
        } catch (error) {
            statusElement.textContent = `Status: Error sharing contact: ${error.message}`;
            statusElement.style.backgroundColor = '#f2dede';
        }
    });
    
    // Set up contact reception callback
    nfcContactSharing.onContactReceived((contact) => {
        receivedContactElement.style.display = 'block';
        receivedContactDataElement.textContent = JSON.stringify(contact, null, 2);
        
        statusElement.textContent = 'Status: New contact received!';
        statusElement.style.backgroundColor = '#dff0d8';
    });
});
