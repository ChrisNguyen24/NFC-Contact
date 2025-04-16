# NFC Contact Sharing Library

A JavaScript library for sharing contact information via NFC in web applications.

## Features

- Easy contact sharing via NFC
- Standard vCard format support
- Contact receiving functionality
- Simple API for web applications

## Requirements

- Device with NFC hardware support
- Browser with Web NFC API support (currently Chrome for Android with a flag enabled)
- HTTPS connection (required for the Web NFC API)

## Usage

### Basic Integration

```javascript
// Import the library
import NFCContactSharing from './NFCContactSharing.js';

// Create an instance
const nfcSharing = new NFCContactSharing();

// Initialize NFC
await nfcSharing.initialize();

// Share a contact
const contact = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1234567890',
  organization: 'Example Corp',
  title: 'Software Developer'
};

await nfcSharing.shareContact(contact);

// Receive contacts
nfcSharing.onContactReceived((contact) => {
  console.log('Received contact:', contact);
});
```

## API Reference

### Constructor

```javascript
const nfcSharing = new NFCContactSharing();
```

### Methods

- `initialize()`: Set up NFC functionality
- `shareContact(contact)`: Share a contact via NFC
- `formatToVCard(contact)`: Convert a contact object to vCard format
- `parseVCard(vCardString)`: Parse a vCard string into a contact object
- `onContactReceived(callback)`: Set a callback for when contacts are received
- `isReady()`: Check if NFC is available and initialized

## Browser Compatibility

The Web NFC API is currently supported in:
- Chrome for Android (with the "Web NFC" flag enabled)
- Chrome OS (with the "Web NFC" flag enabled)

This API is not supported in iOS Safari or desktop browsers.

## Demo

Open the `demo.html` file on a compatible device to test the functionality.

## License

MIT
