/**
 * NFCContactSharing - A class that handles sharing and receiving contacts via NFC
 * For use in mobile web applications with NFC capabilities
 */
class NFCContactSharing {
  constructor() {
    this.isNFCAvailable = false;
    this.ndefReader = null;
    this.onContactReceived = null;
  }

  /**
   * Initialize the NFC capabilities of the device
   * @returns {Promise<boolean>} - Whether NFC was successfully initialized
   */
  async initialize() {
    // Check if NFC is available in this browser/device
    if (!('NDEFReader' in window)) {
      console.error('NFC is not supported in this browser/device');
      return false;
    }

    try {
      this.ndefReader = new NDEFReader();
      await this.ndefReader.scan();
      this.isNFCAvailable = true;
      console.log('NFC initialized successfully');
      
      // Set up the reading event listener
      this._setupReadListener();
      return true;
    } catch (error) {
      console.error('Error initializing NFC:', error);
      return false;
    }
  }

  /**
   * Format contact data as a vCard string
   * @param {Object} contact - The contact object to format
   * @returns {string} - vCard formatted string
   */
  formatToVCard(contact) {
    const vCard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${contact.name || ''}`,
      `N:${contact.lastName || ''};${contact.firstName || ''};;;`,
      contact.email ? `EMAIL:${contact.email}` : '',
      contact.phone ? `TEL:${contact.phone}` : '',
      contact.organization ? `ORG:${contact.organization}` : '',
      contact.title ? `TITLE:${contact.title}` : '',
      contact.url ? `URL:${contact.url}` : '',
      contact.address ? `ADR:;;${contact.address};;;` : '',
      contact.note ? `NOTE:${contact.note}` : '',
      'END:VCARD'
    ].filter(line => line !== '').join('\n');
    
    return vCard;
  }

  /**
   * Parse a vCard string into a contact object
   * @param {string} vCardString - The vCard formatted string
   * @returns {Object} - Contact object
   */
  parseVCard(vCardString) {
    const lines = vCardString.split('\n');
    const contact = {};
    
    lines.forEach(line => {
      if (line.startsWith('FN:')) {
        contact.name = line.substring(3);
      } else if (line.startsWith('N:')) {
        const nameParts = line.substring(2).split(';');
        contact.lastName = nameParts[0] || '';
        contact.firstName = nameParts[1] || '';
      } else if (line.startsWith('EMAIL:')) {
        contact.email = line.substring(6);
      } else if (line.startsWith('TEL:')) {
        contact.phone = line.substring(4);
      } else if (line.startsWith('ORG:')) {
        contact.organization = line.substring(4);
      } else if (line.startsWith('TITLE:')) {
        contact.title = line.substring(6);
      } else if (line.startsWith('URL:')) {
        contact.url = line.substring(4);
      } else if (line.startsWith('ADR:')) {
        const adrParts = line.substring(4).split(';');
        contact.address = adrParts[2] || '';
      } else if (line.startsWith('NOTE:')) {
        contact.note = line.substring(5);
      }
    });
    
    return contact;
  }

  /**
   * Share a contact via NFC
   * @param {Object} contact - The contact to share
   * @returns {Promise<boolean>} - Whether the share was successful
   */
  async shareContact(contact) {
    if (!this.isNFCAvailable) {
      console.error('NFC is not available or not initialized');
      return false;
    }

    try {
      const vCardString = this.formatToVCard(contact);
      await this.ndefReader.write({
        records: [{
          recordType: "text",
          mediaType: "text/vcard",
          data: vCardString
        }]
      });
      console.log('Contact shared successfully');
      return true;
    } catch (error) {
      console.error('Error sharing contact via NFC:', error);
      return false;
    }
  }

  /**
   * Set a callback for when a contact is received
   * @param {Function} callback - Function to call when contact is received
   */
  onContactReceived(callback) {
    this.contactReceivedCallback = callback;
  }

  /**
   * Private method to set up NFC read event listener
   * @private
   */
  _setupReadListener() {
    if (!this.ndefReader) return;

    this.ndefReader.addEventListener("reading", ({ message }) => {
      for (const record of message.records) {
        if (record.recordType === "text" && record.mediaType === "text/vcard") {
          const textDecoder = new TextDecoder();
          const vCardString = textDecoder.decode(record.data);
          const contact = this.parseVCard(vCardString);
          
          if (this.contactReceivedCallback) {
            this.contactReceivedCallback(contact);
          }
        }
      }
    });
  }
  
  /**
   * Check if NFC is available and ready
   * @returns {boolean} - NFC availability status
   */
  isReady() {
    return this.isNFCAvailable;
  }
}

// Export the class for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NFCContactSharing;
}
